import { Button } from './ui/button'
import { z } from 'zod/mini'
import { TextField } from './inputs/TextField'
import { useForm } from '@tanstack/react-form'
import { usePokerContext } from '@/context'
import { useAtom, useSetAtom } from 'jotai'
import { createTopicAtom, topicIndexAtom } from '@/lib/atoms'
import { TypographyH3 } from './ui/typography'
import { MoveLeft, MoveRight } from 'lucide-react'

export function Table() {
  const { roomState } = usePokerContext()

  const [isCreate] = useAtom(createTopicAtom)
  const [topicIndex, setTopicIndex] = useAtom(topicIndexAtom)

  const topics = roomState?.topicList
  const topic = topics?.at(topicIndex)

  return (
    <div className="h-full w-full flex flex-col items-center bg-card border border-muted-foreground rounded-xl p-2">
      {!topic && (
        <TypographyH3 className="text-center">
          Add a Topic to Get Started
        </TypographyH3>
      )}

      {isCreate || !topic ? (
        <TopicForm length={topics?.length ?? 0} />
      ) : (
        <div className="h-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 flex-1 justify-center items-center">
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => setTopicIndex((prev) => prev - 1)}
              disabled={topics && topicIndex <= 0}
            >
              <MoveLeft />
            </Button>
            <Button variant="outline">Reveal</Button>
            <Button
              variant="ghost"
              onClick={() => setTopicIndex((prev) => prev + 1)}
              disabled={topics && topicIndex >= topics.length - 1}
            >
              <MoveRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function TopicForm({ length }: { length: number }) {
  const { addTopic } = usePokerContext()
  const setIsCreate = useSetAtom(createTopicAtom)
  const setTopicIndex = useSetAtom(topicIndexAtom)

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onChange: z.object({
        name: z.string().check(z.minLength(0, 'Topic name is required')),
        description: z
          .string()
          .check(z.minLength(0, 'Description is required')),
      }),
    },
    onSubmit({ value }) {
      addTopic?.({
        ...value,
        stats: { final: '??', mean: 0, median: 0, mode: 0, stddev: 0 },
      })
      setIsCreate(false)
      setTopicIndex(length)
      form.reset()
    },
  })

  return (
    <form
      className="h-full flex flex-col gap-2 justify-center items-center"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <TextField
            label="Topic"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <TextField
            label="Description"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />

      <div className="flex gap-4 items-center">
        <Button type="submit">Add</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsCreate(false)
            form.reset()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
