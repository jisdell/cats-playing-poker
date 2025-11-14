import { Seat } from './Seat'
import { Table } from './Table'

export const PlayArea = () => {
  const names = ['Nova', 'Kai', 'Skylar', 'Axel', 'Zara', 'Leo', 'River']

  const genSeats = (side: number) => {
    return names.map((name, index) =>
      index % 4 === side ? <Seat name={name} /> : null,
    )
  }
  return (
    <div className="grid grid-cols-3 grid-rows-3 ">
      {/* top */}
      <div className="col-span-3 row-start-1 flex items-center justify-center gap-4">
        {genSeats(0)}
      </div>
      {/* right */}
      <div className="col-start-3 row-start-2 flex items-center justify-center flex-col gap-4">
        {genSeats(1)}
      </div>
      {/* middle */}
      <div className="col-start-2 row-start-2 flex items-center justify-center">
        <Table />
      </div>
      {/* bottom */}
      <div className="col-span-3 row-start-3 flex items-center justify-center gap-4">
        {genSeats(2)}
      </div>
      {/* left */}
      <div className="col-start-1 row-start-2 flex items-center justify-center flex-col gap-4">
        {genSeats(3)}
      </div>
    </div>
  )
}
