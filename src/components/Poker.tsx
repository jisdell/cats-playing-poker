import { Hand } from '@/components/Hand'
import { PlayArea } from '@/components/PlayArea'
import { SidebarProvider } from './ui/sidebar'
import { TopicsBar } from './TopicsBar'

export const Poker = () => {
  return (
    <SidebarProvider>
      <div className="flex w-screen h-[calc(100vh-60px)]">
        {/* Poker */}
        <div className="flex flex-col justify-between py-8 flex-1 items-center relative gap-4 overflow-hidden">
          {/* <div className="flex w-full justify-end px-8">
            <SidebarTrigger />
          </div> */}
          <div className="flex-1 flex items-center justify-center w-full">
            <PlayArea />
          </div>
          <Hand />
        </div>
        {/* Topics */}
        <TopicsBar />
      </div>
    </SidebarProvider>
  )
}
