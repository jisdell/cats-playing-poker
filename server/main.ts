import { WebSocketServer, WebSocket } from 'ws'

const port = 9001

// API types
type VoteValue = '1' | '2' | '3' | '4' | '5' | '8' | '??'

interface PlayerState {
  id: string
  username: string
  hasVoted: boolean
  vote: VoteValue | null
}

interface VoteStats {
  final: VoteValue
  mean: number
  median: number
  mode: number
  stddev: number
}

interface PokerTopic {
  name: string
  description: string
  stats: VoteStats | null
  addedByPlayerId: string
}

interface SessionState {
  sessionId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  players: Record<string, PlayerState> // players by clientId
}

interface StateSnapshot {
  sessionId: string
  round: number
  votesRevealed: boolean
  players: PlayerState[]
}

// netcode types
type ClientMessage =
  | {
      type: 'join'
      sessionId: string
      username: string
    }
  | {
      type: 'addTopic'
      value: PokerTopic
    }
  | {
      type: 'removeTopic'
      index: number
    }
  | {
      type: 'vote'
      value: VoteValue
    }
  | {
      type: 'reveal'
    }
  | {
      type: 'newRound'
    }
  | {
      type: 'nudge'
      targetId: string
      emoji: string
    }

type ServerMessage =
  | {
      type: 'state'
      yourId: string
      state: StateSnapshot
    }
  | {
      type: 'nudge'
      fromId: string
      targetId: string
      emoji: string
    }

interface ClientWebSocket extends WebSocket {
  clientId?: string
}

const sessions = new Map<string, SessionState>()
const clientToSession = new Map<string, string>()
const clients = new Map<string, ClientWebSocket>()

let clientCounter = 0

const server = new WebSocketServer({ port })
console.log(`Server listening for client connections on port ${port}`)

function createClientId() {
  clientCounter += 1
  return `c-${clientCounter}-${Math.random().toString(36).slice(2, 8)}`
}

function getOrCreateSession(sessionId: string): SessionState {
  let session = sessions.get(sessionId)
  if (!session) {
    session = {
      sessionId,
      round: 1,
      votesRevealed: false,
      players: {},
      topicList: [],
    }
    sessions.set(sessionId, session)
  }
  return session
}

function broadcastSession(sessionId: string) {
  const session = sessions.get(sessionId)
  if (!session) return

  const playerIds = Object.keys(session.players)

  for (const clientId of playerIds) {
    const ws = clients.get(clientId)
    if (!ws || ws.readyState !== WebSocket.OPEN) continue

    const playersForClient = playerIds.map((pid) => {
      const p = session.players[pid]
      const showVote = session.votesRevealed || pid === clientId
      return {
        id: p.id,
        username: p.username,
        hasVoted: p.hasVoted,
        vote: showVote ? p.vote : null,
      }
    })

    const snapshot: StateSnapshot = {
      sessionId: session.sessionId,
      round: session.round,
      votesRevealed: session.votesRevealed,
      players: playersForClient,
    }

    const msg: ServerMessage = {
      type: 'state',
      yourId: clientId,
      state: snapshot,
    }
    ws.send(JSON.stringify(msg))
  }
}

function revealIfReady(session: SessionState) {
  const players = Object.values(session.players)
  if (players.length === 0) return

  const allVoted = players.every((p) => p.hasVoted)
  if (allVoted && !session.votesRevealed) {
    session.votesRevealed = true
  }
}

server.on('connection', (socket: ClientWebSocket) => {
  const clientId = createClientId()
  socket.clientId = clientId
  clients.set(clientId, socket)

  console.log(`New client connected with clientId: ${clientId}`)
  socket.on('message', (data) => {
    let msg: ClientMessage
    try {
      msg = JSON.parse(data.toString())
    } catch (e) {
      console.error('Failed to parse message', e)
      return
    }

    if (!socket.clientId) return
    const cid = socket.clientId

    if (msg.type === 'join') {
      const session = getOrCreateSession(msg.sessionId)

      session.players[cid] = {
        id: cid,
        username: msg.username,
        hasVoted: false,
        vote: null,
      }
      clientToSession.set(cid, msg.sessionId)

      console.log(
        `Client ${cid} (${msg.username}) joined session ${msg.sessionId}`,
      )

      broadcastSession(msg.sessionId)
      return
    }

    const sessionId = clientToSession.get(cid)
    if (!sessionId) {
      console.warn('Got message from client not in session', cid)
      return
    }

    const session = sessions.get(sessionId)
    if (!session) return

    switch (msg.type) {
      case 'vote': {
        const player = session.players[cid]
        if (!player) return
        player.vote = msg.value
        player.hasVoted = true
        revealIfReady(session)
        broadcastSession(sessionId)
        break
      }
      case 'addTopic': {
        session.topicList = [...session.topicList, msg.value]
        break
      }
      case 'removeTopic': {
        if (msg.index < 0 || msg.index > session.topicList.length - 1) {
          console.error(
            'Error: attempted to remove topic with out-of-bounds index',
          )
          return
        }
        session.topicList = session.topicList.splice(msg.index, 1)
        break
      }
      case 'reveal': {
        session.votesRevealed = true
        broadcastSession(sessionId)
        break
      }
      case 'newRound': {
        session.round += 1
        session.votesRevealed = false
        Object.values(session.players).forEach((p) => {
          p.hasVoted = false
          p.vote = null
        })
        broadcastSession(sessionId)
        break
      }
      case 'nudge': {
        const nudgeMsg: ServerMessage = {
          type: 'nudge',
          fromId: cid,
          targetId: msg.targetId,
          emoji: msg.emoji,
        }
        const targetSocket = clients.get(msg.targetId)
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(JSON.stringify(nudgeMsg))
        }
        break
      }
    }
  })
})
