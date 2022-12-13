import type { NextPage } from 'next'
import { useData } from '../hooks/useData'
import { Button, Group, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import ArticlesList from '../components/ArticlesList'

const Home: NextPage = () => {

  return (
    <ArticlesList title={<Title order={2} mr="xl">Articles</Title>} />
  )
}

export default Home
