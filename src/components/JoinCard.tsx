import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Input } from './ui/input'

export const JoinCard = ({
  join,
}: {
  join(roomId: string, username: string): void
}) => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem('username'),
  )

  const generateRandomCode = (): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (username === null) {
      console.error('username required')
      return
    }
    const newRoomId = generateRandomCode()
    join(newRoomId, username)
    // window.location.href = `/${newRoomId}`
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username === null) {
      console.error('username required')
      return
    }
    join(roomId, username)
    // TODO: Use client-side routing!
    // window.location.href = `/${roomId}`
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="text-center min-w-[400px]">
        <CardHeader>
          <CardTitle>
            {username ? `Howdy, ${username}!` : 'Welcome, Player!'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field className="text-center">
                <InputOTP
                  maxLength={6}
                  id="otp"
                  required
                  value={roomId}
                  onChange={setRoomId}
                >
                  <InputOTPGroup className="w-full flex justify-center gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription>
                  Enter your 6-digit room code
                </FieldDescription>
                <Input
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <FieldGroup>
                <Button type="submit">Join</Button>
                <FieldDescription className="text-center">
                  Don't have a code?{' '}
                  <a href="#" onClick={handleCreate}>
                    Create Room
                  </a>
                </FieldDescription>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
