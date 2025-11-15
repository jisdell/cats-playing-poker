import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const RoomCode = () => {
  const currentPath = window.location.pathname
  const sessionID = currentPath.split('/')[1]

  if (!sessionID) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionID)
    toast.info('Copied Session Code To Clipboard')
  }

  return (
    <div className="flex items-center rounded-md shadow">
      <Button
        variant="ghost"
        className="relative"
        onClick={handleCopyCode}
        title="Copy session code"
      >
        <div className="flex gap-1 text-lg font-mono tracking-widest px-2 py-1">
          {Array.from(sessionID).map((char, idx) => (
            <span key={idx}>{char}</span>
          ))}
        </div>
      </Button>
    </div>
  )
}

export default RoomCode
