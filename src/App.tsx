import './App.css'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>Test</Layout>
      </ThemeProvider>
    </>
  )
}

export default App
