import { createContext } from 'react'
import { usePokerApi } from './hooks/usePokerApi'

export const PokerContext = createContext<
  ReturnType<typeof usePokerApi> | undefined
>(undefined)
