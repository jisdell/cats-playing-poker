// import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

const Init = () => {
  // const [value, setValue] = useState('')
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <Card className="Flex flex-col items-center justify-center max-w-[500px] p-8">
        <Button>Create a New Session</Button>
        or
        <div className="flex flex-row gap-4">
          <Input placeholder="Enter Session ID" className="text-center" />
          <Button>GO</Button>
        </div>
      </Card>
    </div>
  )
}

export default Init
