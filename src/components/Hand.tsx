import { useState } from 'react'
import { Button } from './ui/button'
import type { VoteValue } from '@/hooks/usePokerApi'

const CARD_VALUES: VoteValue[] = ['1', '2', '3', '4', '5', '8', '??']

export const Hand = () => {
  const [selectedCard, setSelectedCard] = useState<VoteValue | null>(null)

  return (
    <div className="flex flex-row w-full justify-center gap-4 pt-8">
      {CARD_VALUES.map((item) => {
        const isSelected = selectedCard === item
        return (
          <Button
            key={item}
            onClick={() => setSelectedCard(isSelected ? null : item)}
            className={`h-40 aspect-5/7 flex flex-col text-center justify-center rounded transition-transform ${
              isSelected
                ? 'bg-primary border-2 border-primary -translate-y-4'
                : 'bg-card-foreground border-2 border-transparent hover:bg-muted-foreground hover:border-primary hover:-translate-y-4'
            }`}
          >
            <h2 className={`text-4xl ${isSelected ? 'text-primary-foreground' : 'text-card'}`}>
              {item}
            </h2>
          </Button>
        )
      })}
    </div>
  )
}
