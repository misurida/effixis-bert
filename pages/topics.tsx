import type { NextPage } from 'next'
import { orderByNameLinkedArticlesActions } from '../utils/globals'
import { Grid, Title, Text, Group, Button, Modal, NumberInput, Popover, Stack, ColorSwatch, Tooltip, Paper, Slider, ThemeIcon, Checkbox, Menu, ActionIcon, Tabs, createStyles, ScrollArea } from '@mantine/core'
import { IconChevronDown, IconDotsVertical } from '@tabler/icons'
import { useMemo, useState } from 'react'
import { useData } from '../hooks/useData'
import { Topic } from '../utils/types'
import OrderByMenu from '../components/OrderByMenu'
import SearchInput from '../components/SearchInput'
import { buildColor, buildTopicName, ColorInput } from '../components/annotations/AnnotationsEditor'
import BttTree from '../components/BttTree'
import { NodeModel } from '@minoru/react-dnd-treeview'
import ArticlesList from '../components/ArticlesList'

const useStyles = createStyles((theme) => ({
  treePreview: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    gap: "1em",
    "& > *": {
      flex: 2,
      minWidth: 300
    }
  },
}));

const Topics: NextPage = () => {

  const {
    topics,
    setTopics,
    filteredTopics,
    topicsQuery,
    setTopicsQuery,
    topicsOrderBy,
    setTopicsOrderBy,
    topicsMinLinkedArticles,
    setTopicsMinLinkedArticles,
    topicsMaxDisplayedArticles,
    setTopicsMaxDisplayedArticles,
    topicsMaxLinkedArticles,
    selectedTopics,
    setSelectedTopics,
    articles,
    setArticles
  } = useData()
  const { classes } = useStyles()
  const [showArticles, setShowArticles] = useState(false);
  const [showTopWords, setShowTopWords] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [localTopicsMaxDisplayedArticles, setlocalTopicsMaxDisplayedArticles] = useState(topicsMaxDisplayedArticles)
  const [localTopicsMinLinkedArticles, setLocalTopicsMinLinkedArticles] = useState(topicsMinLinkedArticles)
  const [selectedTopic, setSelectedTopic] = useState<Topic | undefined>()

  const onBadgeClick = (t: Topic) => {
    if (t.linkedArticles) {
      setShowArticles(true)
      setSelectedTopic(t)
    }
  }

  const randomizeColors = () => {
    setTopics(topics.map(t => ({ ...t, color: t.id.replace("title_model_", "") == "-1" ? "transparent" : buildColor() })))
  }

  const formatNames = () => {
    setTopics(topics.map(t => ({ ...t, name: buildTopicName(t.name) })))
  }

  const onColorChange = (t: Topic, v: string) => {
    const i = topics.findIndex(topic => topic.id === t.id)
    if (i >= 0) {
      const tops: Topic[] = JSON.parse(JSON.stringify(topics))
      tops.splice(i, 1, { ...t, color: v })
      setTopics(tops)
    }
  }

  const onCheckboxClick = (e: Topic) => {
    if (selectedTopics.includes(e.id)) {
      setSelectedTopics(selectedTopics.filter(ee => ee !== e.id))
    }
    else {
      setSelectedTopics([...selectedTopics, e.id])
    }
  }

  const cancelSelection = () => {
    setSelectedTopics([])
  }

  const displayTopWords = (t: Topic) => {
    if (t.topwords?.length) {
      setSelectedTopic(t)
      setShowTopWords(true)
    }
  }

  const handleTreeChange = (value: Topic[]) => {
    setTopics(value)
  }

  const handleTreeSelect = (node: NodeModel) => {
    if (node.id) {
      const id = String(node.id)
      selectedTopics.includes(id) ? setSelectedTopics(selectedTopics.filter(e => e != id)) : setSelectedTopics([...selectedTopics, id])
    }
  }

  const handelTopicDelete = (node: NodeModel) => {

    setTopics(topics.map(e => ({ ...e, linkedArticles: e.linkedArticles?.map(a => ({ ...a, linkedTopics: a.linkedTopics?.map(b => (b !== node.id ? "-1" : b)) })) }))?.filter(e => e.id != node.id) || [])
    setArticles(articles.map(a => ({ ...a, linkedTopics: a.linkedTopics?.map(b => (b !== node.id ? "-1" : b)) })) || [])
  
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Group mb="md">
        <Title order={2} mr="xl">Topics</Title>
        <Group spacing={5}>
          <SearchInput value={topicsQuery} onChange={setTopicsQuery} />
          <Group spacing={5}>
            <OrderByMenu
              onOrderBy={setTopicsOrderBy}
              prop={topicsOrderBy?.prop}
              desc={topicsOrderBy?.desc}
              actions={orderByNameLinkedArticlesActions}
            />
            <Popover opened={showActions} onChange={setShowActions}>
              <Popover.Target>
                <Button
                  variant='light'
                  color="gray"
                  rightIcon={<IconChevronDown size={16} />}
                  onClick={() => setShowActions((o) => !o)}
                >
                  Actions
                </Button>
              </Popover.Target>

              <Popover.Dropdown>
                <Stack sx={{ width: 180 }} spacing="xs">
                  <Button onClick={randomizeColors} variant='default'>Randomize colors</Button>
                  <Button onClick={formatNames} variant='default'>Format topic name</Button>
                  <Text size="xs">
                    Only display topics with {topicsMinLinkedArticles === undefined ? "N" : topicsMinLinkedArticles} or more linked articles
                  </Text>
                  <NumberInput
                    defaultValue={0}
                    min={0}
                    value={topicsMinLinkedArticles}
                    onChange={setTopicsMinLinkedArticles}
                    max={topicsMaxLinkedArticles}
                  />
                  <Slider
                    value={localTopicsMinLinkedArticles}
                    onChange={setLocalTopicsMinLinkedArticles}
                    onChangeEnd={setTopicsMinLinkedArticles}
                    max={topicsMaxLinkedArticles}
                  />
                  <Text size="xs">Number of articles displayed in the topic cards</Text>
                  <NumberInput
                    min={0}
                    max={topicsMaxLinkedArticles < 100 ? topicsMaxLinkedArticles : 100}
                    value={topicsMaxDisplayedArticles}
                    onChange={setTopicsMaxDisplayedArticles}
                  />
                  <Slider
                    value={localTopicsMaxDisplayedArticles}
                    onChange={setlocalTopicsMaxDisplayedArticles}
                    onChangeEnd={setTopicsMaxDisplayedArticles}
                    max={topicsMaxLinkedArticles < 100 ? topicsMaxLinkedArticles : 100}
                  />
                </Stack>
              </Popover.Dropdown>
            </Popover>
            {selectedTopics.length > 0 && (
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <Button size="sm" compact radius="xl" variant="filled" mr={6}>
                    {selectedTopics.length}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={cancelSelection}>Cancel selection</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </Group>
      {filteredTopics.length > 0 ? (
        <Tabs defaultValue="cards">
          <Tabs.List>
            <Tabs.Tab value="cards" >Cards</Tabs.Tab>
            <Tabs.Tab value="tree">Tree</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="cards" pt="xs">
            <Grid>
              {filteredTopics.map(t => (
                <Grid.Col md={6} lg={4} key={t.id}>
                  <Paper shadow="sm" p="md" radius="md" withBorder>
                    <Group position="apart" noWrap spacing={5}>
                      {t.color && (
                        <ColorInput value={t.color} onChange={v => onColorChange(t, v)} dotValue={t.id.replace("title_model_", "")} />
                      )}
                      <Text title={t.id.replace("title_model_", "")} weight={500} mr="auto" sx={{ wordBreak: "break-word" }}>{t.name}</Text>
                      <Checkbox checked={!!selectedTopics.includes(t.id)} onChange={() => onCheckboxClick(t)} />
                      <Button
                        size="sm"
                        color={!t.linkedArticles?.length ? 'gray' : undefined}
                        radius="xs"
                        compact
                        variant="light"
                        onClick={() => onBadgeClick(t)}
                      >
                        {t.linkedArticles?.length}
                      </Button>
                      {((t.topwords?.length || 0) > 0) && (
                        <Menu shadow="md" width={150}>
                          <Menu.Target>
                            <ActionIcon size="xs">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item onClick={() => displayTopWords(t)}>Show Top Words</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Group>
                    {!!topicsMaxDisplayedArticles && (
                      <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8em" }}>
                        {t.linkedArticles?.slice(0, topicsMaxDisplayedArticles).map(a => (
                          <li key={a.id}>
                            <Group spacing={5} noWrap>
                              <Text sx={{ wordBreak: "break-word" }}><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a></Text>
                            </Group>
                          </li>
                        ))}
                      </ol>
                    )}
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="tree" pt="xs">
            <div className={classes.treePreview}>
              <ScrollArea sx={{ flex: 1, minWidth: 400 }}>
                <BttTree
                  data={filteredTopics}
                  onChange={handleTreeChange}
                  onSelect={handleTreeSelect}
                  selection={selectedTopics}
                  onDelete={handelTopicDelete}
                />
              </ScrollArea>
              <Paper p="md" withBorder shadow="sm" sx={{ flex: 2 }}>
                <ArticlesList />
              </Paper>
            </div>
          </Tabs.Panel>

        </Tabs>
      ) : (
        <Text sx={{ opacity: 0.5 }}>No topic found...</Text>
      )}
      <Modal
        opened={showArticles}
        onClose={() => setShowArticles(false)}
        title={selectedTopic?.name}
        size="xl"
      >
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8em" }}>
          {selectedTopic?.linkedArticles?.map(a => (
            <li key={a.id}>
              <Group spacing={5} noWrap>
                {a.linkedTopics?.map(t => {
                  const topic = topics.find(top => top.id === t)
                  return topic ? (
                    <Tooltip key={topic.id} withArrow label={topic.name + ` (${topic.id.replace("title_model_", "")})`}>
                      <ColorSwatch size={12} sx={{ minWidth: 12 }} key={topic.id} color={topic.color || "transparent"} />
                    </Tooltip>
                  ) : null
                })}
                <Text sx={{ wordBreak: "break-word" }}><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a></Text>
              </Group>
            </li>
          ))}
        </ol>
      </Modal>
      <Modal
        opened={showTopWords}
        onClose={() => setShowTopWords(false)}
        title={selectedTopic?.name}
        size="xl"
      >
        <Text>Topic Top Words:</Text>
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8em" }}>
          {selectedTopic?.topwords?.map(a => (
            <li key={a}>
              <Group spacing={5} noWrap>
                <Text sx={{ wordBreak: "break-word" }}>{a}</Text>
              </Group>
            </li>
          ))}
        </ol>
      </Modal>
    </div>
  )
}

export default Topics
