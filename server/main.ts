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

interface NudgeState {
  emoji: string
  fromPlayerId: string
  targetPlayerId: string
}

interface RoomState {
  roomId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  players: Record<string, PlayerState> // players by clientId
}

interface StateSnapshot {
  roomId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  players: PlayerState[]
}

// netcode types
type ClientMessage =
  | {
      type: 'handshake'
    }
  | {
      type: 'join'
      roomId: string
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
      targetPlayerId: string
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
      state: NudgeState
    }

interface ClientWebSocket extends WebSocket {
  clientId?: string
}

const rooms = new Map<string, RoomState>()
const clientToRoom = new Map<string, string>()
const clients = new Map<string, ClientWebSocket>()

let clientCounter = 0

const server = new WebSocketServer({ port })
console.log(`Server listening for client connections on port ${port}`)

function createClientId() {
  clientCounter += 1
  return `c-${clientCounter}-${Math.random().toString(36).slice(2, 8)}`
}

function getOrCreateRoom(roomId: string): RoomState {
  let room = rooms.get(roomId)
  if (!room) {
    room = {
      roomId,
      round: 1,
      votesRevealed: false,
      players: {},
      topicList: [],
    }
    rooms.set(roomId, room)
  }
  return room
}

function broadcastRoom(roomId: string) {
  const room = rooms.get(roomId)
  if (!room) return

  const playerIds = Object.keys(room.players)

  for (const clientId of playerIds) {
    const ws = clients.get(clientId)
    if (!ws || ws.readyState !== WebSocket.OPEN) continue

    const playersForClient = playerIds.map((pid) => {
      const p = room.players[pid]
      const showVote = room.votesRevealed || pid === clientId
      return {
        id: p.id,
        username: p.username,
        hasVoted: p.hasVoted,
        vote: showVote ? p.vote : null,
      }
    })

    const snapshot: StateSnapshot = {
      roomId: room.roomId,
      round: room.round,
      topicList: room.topicList,
      votesRevealed: room.votesRevealed,
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

function revealIfReady(room: RoomState) {
  const players = Object.values(room.players)
  if (players.length === 0) return

  const allVoted = players.every((p) => p.hasVoted)
  if (allVoted && !room.votesRevealed) {
    room.votesRevealed = true
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
      const room = getOrCreateRoom(msg.roomId)

      room.players[cid] = {
        id: cid,
        username: msg.username,
        hasVoted: false,
        vote: null,
      }
      clientToRoom.set(cid, msg.roomId)

      console.log(`Client ${cid} (${msg.username}) joined room ${msg.roomId}`)

      broadcastRoom(msg.roomId)
      return
    }

    const roomId = clientToRoom.get(cid)
    if (!roomId) {
      console.warn('Got message from client not in room', cid)
      return
    }

    const room = rooms.get(roomId)
    if (!room) return

    switch (msg.type) {
      case 'vote': {
        const player = room.players[cid]
        if (!player) return
        player.vote = msg.value
        player.hasVoted = true
        revealIfReady(room)
        broadcastRoom(roomId)
        break
      }
      case 'addTopic': {
        room.topicList = [...room.topicList, msg.value]
        break
      }
      case 'removeTopic': {
        if (msg.index < 0 || msg.index > room.topicList.length - 1) {
          console.error(
            'Error: attempted to remove topic with out-of-bounds index',
          )
          return
        }
        room.topicList = room.topicList.splice(msg.index, 1)
        break
      }
      case 'reveal': {
        room.votesRevealed = true
        broadcastRoom(roomId)
        break
      }
      case 'newRound': {
        room.round += 1
        room.votesRevealed = false
        Object.values(room.players).forEach((p) => {
          p.hasVoted = false
          p.vote = null
        })
        broadcastRoom(roomId)
        break
      }
      case 'nudge': {
        const nudgeMsg: ServerMessage = {
          type: 'nudge',
          state: {
            fromPlayerId: cid,
            targetPlayerId: msg.targetPlayerId,
            emoji: msg.emoji,
          },
        }
        const targetSocket = clients.get(msg.targetPlayerId)
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(JSON.stringify(nudgeMsg))
        }
        break
      }
    }
  })
})
