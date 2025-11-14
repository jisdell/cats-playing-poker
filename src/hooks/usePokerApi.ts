import { useMemo, useState } from 'react'

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

interface SessionState {
  sessionId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  players: PlayerState[]
}

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
      targetPlayerId: string
      emoji: string
    }

type ServerMessage =
  | {
      type: 'state'
      yourId: string
      state: SessionState
    }
  | {
      type: 'nudge'
      state: NudgeState
    }

export const usePokerApi = (
  username: string,
  sessionId: string,
  socketServerUrl: string,
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setConnected] = useState(false)
  const [clientPlayerId, setClientPlayerId] = useState<string | null>(null)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [nudge, setNudge] = useState<NudgeState | null>(null)

  const ws = new WebSocket(socketServerUrl)
  // setSocket(ws)

  ws.onopen = () => {
    setConnected(true)
    const msg: ClientMessage = {
      type: 'join',
      sessionId,
      username,
    }
    ws.send(JSON.stringify(msg))
  }

  ws.onmessage = (event) => {
    let parsed: ServerMessage
    try {
      parsed = JSON.parse(event.data)
    } catch {
      return
    }

    if (parsed.type === 'state') {
      setClientPlayerId(parsed.yourId)
      setSessionState(parsed.state)
    } else if (parsed.type === 'nudge') {
      if (parsed.state.targetPlayerId === clientPlayerId) {
        const nudge = parsed.state
        setNudge(nudge)
      }
    }
  }

  ws.onclose = () => {
    setConnected(false)
    setSocket(null)
    setSessionState(null)
  }

  ws.onerror = () => {
    setConnected(false)
  }

  const sendMessage = (msg: ClientMessage) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify(msg))
  }

  const handleVote = (v: VoteValue) => {
    sendMessage({ type: 'vote', value: v })
  }

  const handleAddTopic = (topic: Omit<PokerTopic, 'addedByPlayerId'>) => {
    if (!clientPlayerId)
      throw new Error('Attempted to add topic without player ID')
    sendMessage({
      type: 'addTopic',
      value: {
        ...topic,
        addedByPlayerId: clientPlayerId,
      },
    })
  }

  const handleRemoveTopic = (topicIndex: number) => {
    sendMessage({ type: 'removeTopic', index: topicIndex })
  }

  const handleReveal = () => {
    sendMessage({ type: 'reveal' })
  }

  const handleNewRound = () => {
    sendMessage({ type: 'newRound' })
  }

  const handleSendNudge = (targetPlayerId: string, emoji: string) => {
    sendMessage({ type: 'nudge', targetPlayerId, emoji })
  }

  const hasEveryoneVoted = useMemo(() => {
    if (!sessionState) return false
    const players = sessionState.players
    if (players.length === 0) return false
    return players.every((p) => p.hasVoted)
  }, [sessionState])

  const closeSocket = () => {
    ws.close()
  }
  return {
    isConnected,
    sessionState,
    vote: handleVote,
    addTopic: handleAddTopic,
    removeTopic: handleRemoveTopic,
    reveal: handleReveal,
    newRound: handleNewRound,
    sendNudge: handleSendNudge,
    activeNudge: nudge,
    hasEveryoneVoted,
    closeSocket,
  }
}
