import { createContext, useContext } from 'react'
import { usePokerApi } from './hooks/usePokerApi'

type UsePokerApiReturn = ReturnType<typeof usePokerApi>

export const PokerContext = createContext<undefined | UsePokerApiReturn>(
  undefined,
)

export function usePokerContext() {
  return useContext(PokerContext) || ({} as Partial<UsePokerApiReturn>)
}
