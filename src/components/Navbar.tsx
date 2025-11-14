import { ModeToggle } from './mode-toggle'

export const Navbar = () => {
  return (
    <div className="w-[100vw] flex flex-row justify-between px-8 items-center">
      <h2 className="text-primary scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Cats Poker Planning
      </h2>
      <ModeToggle />
    </div>
  )
}
