import { Provider } from 'jotai'
import { DevTools } from 'jotai-devtools'
import css from 'jotai-devtools/styles.css?inline'

type ProviderProps = React.ComponentProps<typeof Provider>

export const JotaiDevTools = () =>
  import.meta.env.MODE !== 'production' ? (
    <>
      <style>{css}</style>
      <DevTools />
    </>
  ) : null

export const JotaiProvider = ({ children, ...props }: ProviderProps) => (
  <Provider {...props}>
    <JotaiDevTools />
    {children}
  </Provider>
)
