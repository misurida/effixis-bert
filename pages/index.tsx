import type { NextPage } from 'next'
import { useData } from '../hooks/useData'
import { Button, Group } from '@mantine/core'
import { useRouter } from 'next/router'

const Home: NextPage = () => {

  const router = useRouter()
  const { events, topics } = useData()

  return (
    <Group>
      {events.length > 0 && (
        <Button onClick={() => router.push('/events')} size="lg" variant='outline'>Events view</Button>
      )}
      {topics.length > 0 && (
        <Button onClick={() => router.push('/topics')} size="lg" variant='outline'>Topics view</Button>
      )}
    </Group>
  )
}

export default Home
