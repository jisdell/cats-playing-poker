import { useEffect, useMemo, useRef, useState } from 'react'

export type VoteValue = '1' | '2' | '3' | '4' | '5' | '8' | '??'

export interface PlayerState {
  id: string
  username: string
  hasVoted: boolean
  vote: VoteValue | null
}

export interface VoteStats {
  final: VoteValue
  mean: number
  median: number
  mode: number
  stddev: number
}

export interface PokerTopic {
  name: string
  description: string
  stats: VoteStats | null
  addedByPlayerId: string
}

export interface NudgeState {
  emoji: string
  fromPlayerId: string
  targetPlayerId: string
}

export interface RoomState {
  roomId: string
  round: number
  topicList: PokerTopic[]
  votesRevealed: boolean
  players: PlayerState[]
}

export type ClientMessage =
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

export type ServerMessage =
  | {
      type: 'state'
      yourId: string
      state: RoomState
    }
  | {
      type: 'nudge'
      state: NudgeState
    }

export type ClientConfig = {
  username: string
  roomId: string
}

export const usePokerApi = (
  // username: string,
  // roomId: string,
  socketServerUrl: string = 'ws://localhost:9001',
) => {
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null)
  const [isConnected, setConnected] = useState(false)
  const [clientPlayerId, setClientPlayerId] = useState<string | null>(null)
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [nudge, setNudge] = useState<NudgeState | null>(null)

  // const ws = new WebSocket(socketServerUrl)
  // setSocket(ws)

  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    // Create a new websocket if we don't already have one:
    if (!ws.current) {
      ws.current = new WebSocket(socketServerUrl)

      // Register a listener to detect incoming messages:
      ws.current.addEventListener('message', (event) => {
        switch (event.data.type) {
          case 'state': {
            const { state, yourId: myId } = event.data
            // If we receive a new state and don't already have one,
            // assume that we're connecting for the first time:
            if (roomState === null && state) {
              setConnected(true)
              // Server is responsible for allocating us an ID:
              setClientPlayerId(myId)
            }
            setRoomState(event.data.state)
            break
          }
          case 'nudge': {
            setNudge(event.data.state)
            break
          }
          default: {
            console.error(
              `Got unknown message from server:\n${JSON.stringify(event.data, null, 2)}`,
            )
          }
        }
      })
    }

    // Handle initial handshake if not already connected:
    ws.current.onopen = () => {
      if (!clientConfig)
        throw new Error(
          `Missing client config (roomId, username); can't open connection.`,
        )
      if (!isConnected && !!ws.current) {
        const msg: ClientMessage = {
          type: 'join',
          ...clientConfig,
        }
        console.log(JSON.stringify(msg, null, 2))
        ws.current.send(JSON.stringify(msg))
      }
      console.log('client socket opened, join msg sent')
    }

    // Handle cleanup on socket close (forget state + identity):
    ws.current.onclose = () => {
      console.log('Client socket closed, clearing client state')
      setRoomState(null)
      setNudge(null)
      setClientPlayerId(null)
    }

    const wsCurrent = ws?.current

    // Close the socket whenever the calling component unmounts
    return () => {
      wsCurrent?.close()
    }
  }, [isConnected, socketServerUrl, clientConfig, roomState])

  // ws.onerror = () => {
  //   setConnected(false)
  // }

  const sendMessage = (msg: ClientMessage) => {
    if (ws.current) {
      ws.current.send(JSON.stringify(msg))
    } else {
      throw new Error(
        `Can't send client message; websocket currently uninitialized`,
      )
    }
  }

  // BEGIN API handlers:

  const handleInitClientConfig = (roomId: string, username: string) => {
    // TODO: Maybe validate at some point
    setClientConfig({ roomId, username })
  }

  const handleJoin = (roomId: string, username: string) => {
    sendMessage({
      type: 'join',
      roomId,
      username,
    })
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

  const handleVote = (v: VoteValue) => {
    sendMessage({ type: 'vote', value: v })
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
    if (!roomState) return false
    const players = roomState.players
    if (players.length === 0) return false
    return players.every((p) => p.hasVoted)
  }, [roomState])

  const closeSocket = () => {
    if (ws.current) ws.current.close()
  }
  return {
    isConnected,
    roomState,
    initClientConfig: handleInitClientConfig,
    join: handleJoin,
    addTopic: handleAddTopic,
    removeTopic: handleRemoveTopic,
    vote: handleVote,
    reveal: handleReveal,
    newRound: handleNewRound,
    sendNudge: handleSendNudge,
    activeNudge: nudge,
    hasEveryoneVoted,
    closeSocket,
  }
}
