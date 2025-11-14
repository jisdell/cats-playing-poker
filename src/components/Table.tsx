import { Button } from './ui/button'
import { Card } from './ui/card'

export const Table = () => {
  const topic = 'placeholder topic'
  const description = 'placeholder description'
  return (
    <Card>
      <div>
        <h3>{topic}</h3>
        <p>{description}</p>
        <div>
          <Button>{'<-'}</Button>
          <Button>Reveal</Button>
          <Button>{'->'}</Button>
        </div>
      </div>
    </Card>
  )
}
