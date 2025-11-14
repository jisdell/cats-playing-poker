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
}

interface SessionState {
  sessionId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  participants: Record<string, PlayerState> // players by clientId
}

interface StateSnapshot {
  sessionId: string
  round: number
  currentTopicIndex: number
  votesRevealed: boolean
  participants: PlayerState[]
}

// netcode types
type ClientMessage =
  | {
      type: 'join'
      sessionId: string
      username: string
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
