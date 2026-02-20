import { usePokerContext } from '@/context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'
import { Button } from './ui/button'
import { useSetAtom } from 'jotai'
import { createTopicAtom, topicIndexAtom } from '@/lib/atoms'
import { PlusIcon } from 'lucide-react'

export function TopicsBar() {
  const { roomState, isConnected } = usePokerContext()
  const topics = roomState?.topicList

  const setIsCreate = useSetAtom(createTopicAtom)
  const setTopicIndex = useSetAtom(topicIndexAtom)

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="icon"
      className="top-[60px] h-[calc(100vh-60px)]"
    >
      <SidebarHeader>
        <h2 className="px-2 text-lg font-semibold tracking-tight text-center">
          Game Topics ({topics?.length ?? 0})
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Session Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topics && topics.length > 0 ? (
                topics.map((topic, index) => (
                  <SidebarMenuItem key={`${topic.name}-${index}`}>
                    <SidebarMenuButton
                      tooltip={topic.name}
                      onClick={() => setTopicIndex(index)}
                    >
                      <span className="truncate flex-1 font-medium">
                        {topic.name}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground italic border border-dashed rounded-lg mx-2 mt-2">
                  No topics added yet.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t gap-4 flex flex-col">
        <Button
          onClick={() => setIsCreate(true)}
          variant="outline"
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
