import { Home } from 'lucide-react'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'

export const HomeButton = () => {
  const navigate = useNavigate()
  return (
    <Button variant="outline" size="icon" onClick={() => navigate({ to: '/' })}>
      <Home className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
