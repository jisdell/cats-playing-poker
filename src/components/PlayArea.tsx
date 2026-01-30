import { Seat } from './Seat'
import { Table } from './Table'
import type { PlayerState } from '@/hooks/usePokerApi'
// import { getRouteApi, useLocation } from '@tanstack/react-router'

export const PlayArea = () => {
  // const location = useLocation({
  //   select: (location) => location.pathname
  // })
  const mockPlayers: PlayerState[] = [
    { id: '1', username: 'Nova', hasVoted: false, vote: null },
    { id: '2', username: 'Kai', hasVoted: true, vote: '3' },
    { id: '3', username: 'Skylar', hasVoted: false, vote: null },
    { id: '4', username: 'Axel', hasVoted: true, vote: '5' },
    { id: '5', username: 'Zara', hasVoted: false, vote: null },
    { id: '6', username: 'Leo', hasVoted: true, vote: '2' },
  ]

  const genSeats = (side: number) => {
    return mockPlayers.map((player, index) =>
      index % 4 === side ? <Seat key={player.id} player={player} /> : null,
    )
  }

  const seatContainerBase = 'flex items-center justify-center gap-4'
  const seatContainerVertical =
    'flex items-center justify-center flex-col gap-4'

  return (
    <div
      className="grid w-[80%]"
      style={{
        gridTemplateColumns: 'auto 1fr auto',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      {/* top */}
      <div
        className={`${seatContainerBase} col-span-1 row-start-1 col-start-2 p-4`}
      >
        {genSeats(0)}
      </div>
      {/* right */}
      <div className={`${seatContainerVertical} col-start-3 row-start-2`}>
        {genSeats(1)}
      </div>
      {/* middle */}
      <div className="w-[80%] aspect-4/2 col-start-2 row-start-2 flex justify-self-center">
        <Table />
      </div>
      {/* bottom */}
      <div
        className={`${seatContainerBase} col-span-1 row-start-3 col-start-2 p-4`}
      >
        {genSeats(2)}
      </div>
      {/* left */}
      <div className={`${seatContainerVertical} col-start-1 row-start-2`}>
        {genSeats(3)}
      </div>
    </div>
  )
}
