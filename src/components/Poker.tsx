import { Hand } from '@/components/Hand'
import { PlayArea } from '@/components/PlayArea'

export const Poker = () => {
  return (
    <div className="flex w-screen h-[calc(100vh-60px)]">
      {/* Poker */}
      <div className="flex flex-col justify-between py-8 w-3/4 items-center">
        <PlayArea />
        <Hand />
      </div>
      {/* Topics */}
      <div className="w-1/4 bg-card">
        This is where topics will be listed
      </div>
    </div>
  )
}
