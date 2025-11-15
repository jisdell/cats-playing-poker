import { ModeToggle } from './mode-toggle'
import RoomCode from './RoomCode'

export const Navbar = () => {
  return (
    <div className="w-screen h-full flex flex-row justify-between px-8 items-center">
      <h2
        className="text-primary scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        Cats Poker Pointing
      </h2>

      <div className="flex flex-row gap-4 items-center">
        <RoomCode />
        <ModeToggle />
      </div>
    </div>
  )
}
