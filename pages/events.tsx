import type { NextPage } from 'next'
import { Title, Text, Paper, Modal, Badge, Group, Popover, Button, Stack, NumberInput, Tooltip, ColorSwatch, Slider, ThemeIcon } from '@mantine/core'
import { useData } from '../hooks/useData'
import { useMemo, useState } from 'react';
import { Event } from '../utils/types';
import { IconChevronDown, IconFilterOff } from '@tabler/icons';
import { orderByDateActions, orderByNameLinkedArticlesActions } from '../utils/globals';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import dayjs from 'dayjs';
import SearchInput from '../components/SearchInput';
import SearchDate from '../components/SearchDate';
import OrderByMenu from '../components/OrderByMenu';

const Events: NextPage = () => {

  const {
    topics,
    events,
    filteredEvents,
    eventsQuery,
    setEventsQuery,
    eventsOrderBy,
    setEventsOrderBy,
    eventsMinLinkedArticles,
    setEventsMinLinkedArticles,
    eventsDateFilter,
    setEventsDateFilter,
    eventsMaxLinkedArticles
  } = useData()
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>()
  const [opened, setOpened] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [localEventsMinLinkedArticles, setLocalEventsMinLinkedArticles] = useState(eventsMinLinkedArticles)

  const items = useMemo(() => filteredEvents.length > 0 ? filteredEvents : events, [filteredEvents, events])

  const onEventClick = (e: Event) => {
    console.dir(e)
    setOpened(true)
    setSelectedEvent(e)
  }


  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Group mb="md">
        <Title order={2} mr="xl">Events</Title>
        <Group spacing={5}>
          <SearchInput value={eventsQuery} onChange={setEventsQuery} noMatch={!!eventsQuery && !filteredEvents.length} />
          {!filteredEvents.length && (
            <Tooltip withArrow label="No events filtered: the full list is displayed.">
              <ThemeIcon color="gray" variant="light">
                <IconFilterOff size={18} />
              </ThemeIcon>
            </Tooltip>
          )}
          <Group spacing={5}>
            <SearchDate dateFilter={eventsDateFilter} onChange={setEventsDateFilter} />
            <OrderByMenu
              onOrderBy={setEventsOrderBy}
              prop={eventsOrderBy?.prop}
              desc={eventsOrderBy?.desc}
              actions={[...orderByNameLinkedArticlesActions, ...orderByDateActions]}
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
                    Only display events with {eventsMinLinkedArticles === undefined ? "N" : eventsMinLinkedArticles} or more linked articles
                  </Text>
                  <NumberInput
                    min={0}
                    max={eventsMaxLinkedArticles}
                    value={eventsMinLinkedArticles}
                    onChange={setEventsMinLinkedArticles}
                  />
                  <Slider
                    value={localEventsMinLinkedArticles}
                    onChange={setLocalEventsMinLinkedArticles}
                    onChangeEnd={setEventsMinLinkedArticles}
                    max={eventsMaxLinkedArticles}
                  />
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Group>
      {items.length > 0 ? (
        <div style={{ flex: 1 }}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={items.length}
                itemSize={40}
              >
                {({ index, style }) => {
                  const event = items[index];
                  return <div style={style}>
                    <Paper
                      withBorder
                      onClick={() => onEventClick(event)}
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
                        title={event.name}
                        style={{
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginLeft: 5
                        }}>
                        {event.name}
                      </Text>
                      <Tooltip position='left' label={`Linked articles (${event.linkedArticles?.length})`} withArrow>
                        <Badge>
                          {event.linkedArticles?.length}
                        </Badge>
                      </Tooltip>
                      <Text mx="md">
                        {dayjs(event.date).format('DD.MM.YYYY')}
                      </Text>
                    </Paper>
                  </div>;
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      ) : (
        <Text sx={{ opacity: 0.5 }}>No event found...</Text>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={selectedEvent?.name}
        size="xl"
      >
        <Text>ID: {selectedEvent?.id}</Text>
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8em" }}>
          {selectedEvent?.linkedArticles?.map(a => (
            <li key={a.id}>
              <Group spacing={5}>
                {a.linkedTopics?.map(t => {
                  const topic = topics.find(top => top.id === t)
                  return topic ? (
                    <Tooltip key={topic.id} withArrow label={topic.name + ` (${topic.id.replace("title_model_", "")})`}>
                      <ColorSwatch key={topic.id} color={topic.color || "transparent"} size={16} />
                    </Tooltip>
                  ) : null
                })}
                <Text><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a></Text>
              </Group>
            </li>
          ))}
        </ol>
      </Modal>
    </div>
  )
}

export default Events
