import './App.css'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { Poker } from './pages/Poker'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>
          <Poker />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default App
