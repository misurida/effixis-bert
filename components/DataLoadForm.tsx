import { Box, Button, FileInput, Group, Modal, Popover, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { useData } from "../hooks/useData";
import { Data } from "../utils/types";
import { isValidData } from "../utils/validation";


export function processFile<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        return resolve(JSON.parse(event.target.result as string) as T);
      }
      return reject([])
    }
    reader.readAsText(file);
  })
}

export async function importFile<T>(file: File | null, name: "combo") {
  if (file) {
    const data: Data = await processFile(file);
    try {
      if (name === "combo") {
        isValidData(data)
      }
      showNotification({ message: "Collection imported", color: "green", icon: <IconCheck size={18} /> })
      return data;
    }
    catch (e: any) {
      showNotification({ message: e, color: "red", icon: <IconX size={18} /> })
    }
  }
  return [] as any
}


export default function DataLoadForm() {

  const {
    articles,
    filteredArticles,
    events,
    filteredEvents,
    topics,
    filteredTopics,
    entities,
    loadData
  } = useData()
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false)
  const [combinedFile, setCombinedFile] = useState<File | null>(null)

  const load = async () => {
    if (combinedFile) {
      const data = await processFile<Data>(combinedFile);
      try {
        isValidData(data)
        setLoading(true)
        await loadData(data)
        setLoading(false)
        showNotification({ message: "Collection imported", color: "green", icon: <IconCheck size={18} /> })
        setOpened(false)
      }
      catch (e: any) {
        showNotification({ message: e, color: "red", icon: <IconX size={18} /> })
      }
    }
    return [] as any
  }

  return (
    <Box>
      <Stack>
        <Button fullWidth onClick={() => setOpened(true)}>Upload data</Button>
        <table>
          <tbody>
            {articles.length > 0 && (
              <tr>
                <td>
                  <Text size="xs">articles</Text>
                </td>
                <td>
                  <Popover position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <Text size="xs">{(filteredArticles.length > 0 ? filteredArticles : articles)?.length}</Text>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}><Text size="xs">Min date</Text></td>
                            <td><Text size="xs">{articles.reduce<dayjs.Dayjs | null>((a, e) => a === null || dayjs(e.date).isBefore(a) ? dayjs(e.date) : a, null)?.format("DD.MM.YYYY")}</Text></td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}><Text size="xs">Max date</Text></td>
                            <td><Text size="xs">{articles.reduce<dayjs.Dayjs | null>((a, e) => a === null || dayjs(e.date).isAfter(a) ? dayjs(e.date) : a, null)?.format("DD.MM.YYYY")}</Text></td>
                          </tr>
                        </tbody>
                      </table>
                    </Popover.Dropdown>
                  </Popover>
                </td>
              </tr>
            )}
            {events.length > 0 && (
              <tr>
                <td>
                  <Text size="xs">events</Text>
                </td>
                <td>
                  <Popover position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <Text size="xs">{(filteredEvents.length > 0 ? filteredEvents : events)?.length}</Text>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}><Text size="xs">Min date</Text></td>
                            <td><Text size="xs">{events.reduce<dayjs.Dayjs | null>((a, e) => a === null || dayjs(e.date).isBefore(a) ? dayjs(e.date) : a, null)?.format("DD.MM.YYYY")}</Text></td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}><Text size="xs">Max date</Text></td>
                            <td><Text size="xs">{events.reduce<dayjs.Dayjs | null>((a, e) => a === null || dayjs(e.date).isAfter(a) ? dayjs(e.date) : a, null)?.format("DD.MM.YYYY")}</Text></td>
                          </tr>
                        </tbody>
                      </table>
                    </Popover.Dropdown>
                  </Popover>
                </td>
              </tr>
            )}
            {topics.length > 0 && (
              <tr>
                <td>
                  <Text size="xs">topics</Text>
                </td>
                <td>
                  <Text size="xs">{topics?.length}</Text>
                </td>
              </tr>
            )}
            {entities.length > 0 && (
              <tr>
                <td>
                  <Text size="xs">entities</Text>
                </td>
                <td>
                  <Text size="xs">{entities?.length}</Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Stack>
      <Modal
        opened={opened}
        onClose={() => { if (!loading) setOpened(false) }}
        title="Upload data"
      >
        <FileInput
          placeholder="Upload a data json file..."
          label="Data"
          value={combinedFile}
          onChange={setCombinedFile}
        />
        <Group mt="md" position="right">
          <Button onClick={load} loading={loading} disabled={!combinedFile}>Load</Button>
        </Group>
      </Modal>
    </Box>
  )
}
