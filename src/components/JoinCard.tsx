import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export const JoinCard = () => {
  const [otpValue, setOtpValue] = useState('')
  const [playerName, setPlayerName] = useState<string | null>(null)

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    setPlayerName(name)
  }, [])

  const generateRandomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const code = generateRandomCode()
    window.location.href = `/${code}`
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.location.href = `/${otpValue}`
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="text-center min-w-[400px]">
        <CardHeader>
          <CardTitle>
            {playerName ? `Howdy, ${playerName}!` : 'Welcome, Player!'}
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
                  value={otpValue}
                  onChange={setOtpValue}
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
                  Enter your 6-digit session code
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Button type="submit">Join</Button>
                <FieldDescription className="text-center">
                  Don't have a code? <a href="#" onClick={handleCreate}>Create Room</a>
                </FieldDescription>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
