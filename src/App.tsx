import './App.css'
import Init from './components/Init'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { Poker } from './pages/Poker'

function App() {
  const currentPath = window.location.pathname
  const sessionID = currentPath.split('/')[1]
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>{sessionID ? <Poker /> : <Init />}</Layout>
      </ThemeProvider>
    </>
  )
}

export default App
