import { useEffect } from 'react'
import './App.css'
import { JoinCard } from './components/JoinCard'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { usePokerApi } from './hooks/usePokerApi'
import { Poker } from './pages/Poker'

function App() {
  const currentPath = window.location.pathname
  const sessionID = currentPath.split('/')[1]

  const {
    isConnected,
    roomState,
    initClientConfig,
    join,
    addTopic,
    removeTopic,
    vote,
    reveal,
    newRound,
    sendNudge,
    nudge,
    hasEveryoneVoted,
    closeSocket,
  } = usePokerApi()

  useEffect(() => {
    console.log(isConnected, Date.now())
  }, [isConnected])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>{sessionID ? <Poker /> : <JoinCard join={join} />}</Layout>
      </ThemeProvider>
    </>
  )
}

export default App
