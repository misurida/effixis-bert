import { Text, Paper, Modal, Badge, ColorSwatch, Group, Tooltip, Button, NumberInput, Popover, Stack, Slider, ThemeIcon } from '@mantine/core'
import { useData } from '../hooks/useData'
import { useMemo, useState } from 'react';
import { Article } from '../utils/types';
import { getContrastColor } from './annotations/AnnotationsEditor'
import { IconChevronDown, IconFilterOff } from '@tabler/icons';
import { orderByDateActions, orderByTitleActions } from '../utils/globals';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import OrderByMenu from './OrderByMenu'
import dayjs from 'dayjs';
import SearchDate from './SearchDate'
import SearchInput from './SearchInput'

function ArticlesList(props: {
  title?: React.ReactNode
  articles?: Article[]
}) {

  const {
    articles,
    filteredArticles,
    topics,
    articlesQuery,
    setArticlesQuery,
    articlesOrderBy,
    setArticlesOrderBy,
    articlesMinLinkedEntities,
    setArticlesMinLinkedEntities,
    articlesDateFilter,
    setArticlesDateFilter,
    articlesMaxLinkedEntities
  } = useData()
  const [opened, setOpened] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | undefined>()
  const [localArticlesMinLinkedEntities, setLocalArticlesMinLinkedEntities] = useState(articlesMinLinkedEntities)

  const items = useMemo(() => {
    if(props.articles) {
      return props.articles
    }
    return filteredArticles.length > 0 ? filteredArticles : articles
  }, [filteredArticles, articles, props.articles])

  const onEventClick = (e: Article) => {
    setOpened(true)
    setSelectedArticle(e)
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Group mb="md">
        {props.title}
        <Group spacing={5}>
          <SearchInput value={articlesQuery} onChange={setArticlesQuery} noMatch={!!articlesQuery && !filteredArticles.length} />
          {!filteredArticles.length && (
            <Tooltip withArrow label="No articles filtered: the full list is displayed.">
              <ThemeIcon color="gray" variant="light">
                <IconFilterOff size={18} />
              </ThemeIcon>
            </Tooltip>
          )}
          <Group spacing={5}>
            <SearchDate dateFilter={articlesDateFilter} onChange={setArticlesDateFilter} />
            <OrderByMenu
              onOrderBy={setArticlesOrderBy}
              prop={articlesOrderBy?.prop}
              desc={articlesOrderBy?.desc}
              actions={[...orderByTitleActions, ...orderByDateActions]}
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
                  <Text size="xs">
                    Only display articles with {articlesMinLinkedEntities === undefined ? "N" : articlesMinLinkedEntities} or more linked articles
                  </Text>
                  <NumberInput
                    min={0}
                    max={articlesMaxLinkedEntities}
                    value={articlesMinLinkedEntities}
                    onChange={setArticlesMinLinkedEntities}
                  />
                  <Slider
                    value={localArticlesMinLinkedEntities}
                    onChange={setLocalArticlesMinLinkedEntities}
                    onChangeEnd={setArticlesMinLinkedEntities}
                    max={articlesMaxLinkedEntities}
                  />
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Group>
      {items.length > 0 ? (
        <div style={{ flex: 1 }}>
          <AutoSizer style={{ height: "76vh" }}>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={items.length}
                itemSize={40}
              >
                {({ index, style }) => {
                  const article = items[index];
                  return <div style={style}>
                    <Paper
                      withBorder
                      onClick={() => onEventClick(article)}
                      px="md"
                      py={5}
                      sx={{
                        display: "flex",
                        transition: "opacity .1s",
                        alignItems: "center",
                        cursor: "pointer",
                        ".floatingIndex": {
                          opacity: 0
                        },
                        "&:hover": {
                          opacity: 0.8,
                          ".floatingIndex": {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <span className="floatingIndex" style={{ position: "absolute", left: 0, top: 0, fontSize: 8, paddingLeft: 2 }}>{index + 1}</span>
                      <Text
                        title={article.title}
                        style={{
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                        {article.title}
                      </Text>
                      <Group mr={5}>
                        {article.linkedTopics?.map(t => {
                          const topic = topics.find(top => top.id === t)
                          return topic ? (
                            <Tooltip key={topic.id} withArrow position='left' label={topic.name + ` (${topic.id.replace("title_model_", "")})`}>
                              <ColorSwatch color={topic.color || "transparent"}>
                                <Text weight="bold" size="xs" sx={{ color: topic.color ? getContrastColor(topic.color) : "transparent" }} title={topic.id}>{topic.id.replaceAll("title_model_", "")}</Text>
                              </ColorSwatch>
                            </Tooltip>
                          ) : null
                        })}
                      </Group>
                      <Tooltip withArrow position='left' label={`Linked entities (${article.linkedEntities?.length})`}>
                        <Badge>
                          {article.linkedEntities?.length}
                        </Badge>
                      </Tooltip>
                      <Text ml="md">
                        {dayjs(article.date).format('DD.MM.YYYY')}
                      </Text>
                    </Paper>
                  </div>
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      ) : (
        <Text sx={{ opacity: 0.5 }}>No article found...</Text>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={selectedArticle?.title}
        size="xl"
      >
        <Text mt="xl">Source: <a href={selectedArticle?.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Link</a></Text>
        <Text>ID: {selectedArticle?.id}</Text>
        <Text size="xl" weight="bold" mt="lg">Linked entities</Text>
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8em" }}>
          {selectedArticle?.linkedEntities?.map(e => (
            <li key={e.id}><Text>{e.name}</Text></li>
          ))}
        </ol>
      </Modal>
    </div>
  )
}

export default ArticlesList
