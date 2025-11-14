import { Navbar } from './Navbar'
import { Toaster } from 'sonner'
import { ScrollArea } from './ui/scroll-area'
import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="h-screen flex flex-col bg-background text-foreground">
    <header className="bg-background text-foreground py-2 border-b border-muted">
      <Navbar />
    </header>

    <main className="grow overflow-auto">
      <ScrollArea className="h-full px-8">{children}</ScrollArea>
      <Toaster />
    </main>
  </div>
)
