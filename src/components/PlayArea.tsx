import { Seat } from './Seat'
import { Table } from './Table'
import { usePokerContext } from '@/context'

export const PlayArea = () => {
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
        <Seats side={0} />
      </div>
      {/* right */}
      <div className={`${seatContainerVertical} col-start-3 row-start-2`}>
        <Seats side={1} />
      </div>
      {/* middle */}
      <div className="w-[80%] aspect-4/2 col-start-2 row-start-2 flex justify-self-center">
        <Table />
      </div>
      {/* bottom */}
      <div
        className={`${seatContainerBase} col-span-1 row-start-3 col-start-2 p-4`}
      >
        <Seats side={2} />
      </div>
      {/* left */}
      <div className={`${seatContainerVertical} col-start-1 row-start-2`}>
        <Seats side={3} />
      </div>
    </div>
  )
}

const Seats = ({ side }: { side: number }) => {
  const { roomState } = usePokerContext()
  const players = roomState?.players

  return players?.map((player, index) =>
    index % 4 === side ? <Seat key={player.id} player={player} /> : null,
  )
}
