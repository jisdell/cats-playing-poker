import { Avatar, AvatarFallback } from './ui/avatar'
import type { PlayerState } from '@/hooks/usePokerApi'

export const Seat = ({ player }: { player: PlayerState }) => {
  return (
    <Avatar className="h-20 w-20 border-radius-[50%] rounded-md">
      <AvatarFallback className={player.hasVoted ? 'bg-primary' : ''}>
        {player.username}
      </AvatarFallback>
    </Avatar>
  )
}
