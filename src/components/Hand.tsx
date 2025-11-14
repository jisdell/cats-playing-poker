import { Button } from './ui/button'

type VoteValue = '1' | '2' | '3' | '4' | '5' | '8' | '??'

const CARD_VALUES = ['1', '2', '3', '4', '5', '8', '??'] as VoteValue[]

export const Hand = () => {
  return (
    <div className="flex flex-row gap-4">
      {CARD_VALUES.map((item) => (
        <Button className="h-[10rem] w-[5rem] flex flex-col text-center justify-center bg-card-foreground rounded hover:bg-muted-foreground">
          <h2 className="text-card text-4xl">{item}</h2>
        </Button>
      ))}
    </div>
  )
}
