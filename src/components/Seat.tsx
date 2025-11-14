import { Avatar, AvatarFallback } from './ui/avatar'

export const Seat = ({ name }: { name: string }) => {
  return (
    <Avatar className="h-20 w-20 border-radius-[50%] rounded-md">
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  )
}
