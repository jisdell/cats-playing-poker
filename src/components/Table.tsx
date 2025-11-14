import { Button } from './ui/button'
import { Card } from './ui/card'

export const Table = () => {
  const topic = 'placeholder topic'
  const description = 'placeholder description'
  return (
    <Card className="h-full w-full flex flex-col items-center">
      <div className="h-full flex flex-col justify-between">
        <div>
          <h3>{topic}</h3>
          <p>{description}</p>
        </div>
        <div className="flex gap-4">
          <Button>{'<-'}</Button>
          <Button>Reveal</Button>
          <Button>{'->'}</Button>
        </div>
      </div>
    </Card>
  )
}
