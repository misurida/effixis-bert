import { Box, Group, ScrollArea, Title, Text, Checkbox, Badge, Button, Tooltip, ActionIcon, Menu } from "@mantine/core";
import { IconFilter, IconSortAscending, IconSortDescending } from "@tabler/icons";
import { useMemo } from "react";
import { useData } from "../hooks/useData";
import { orderByNameLinkedArticlesActions } from "../utils/globals";
import { Entity } from "../utils/types";
import OrderByMenu from "./OrderByMenu";

export default function EntitiesList() {

  const { entities, filteredEntities, setSelectedEntities, selectedEntities, entitiesOrderBy, setEntitiesOrderBy } = useData()

  const items = useMemo(() => !entitiesOrderBy ? entities : filteredEntities, [entitiesOrderBy, entities, filteredEntities])

  const onClick = (e: Entity) => {
    if (selectedEntities.includes(e.id)) {
      setSelectedEntities(selectedEntities.filter(ee => ee !== e.id))
    }
    else {
      setSelectedEntities([...selectedEntities, e.id])
    }
  }

  const cancelSelection = () => {
    setSelectedEntities([])
  }

  return items.length > 0 ? (
    <>
      <Group my="md" spacing={5}>
        <Title order={3} mr="auto">Entities</Title>
        <Group>
          <OrderByMenu
            onOrderBy={setEntitiesOrderBy}
            prop={entitiesOrderBy?.prop}
            desc={entitiesOrderBy?.desc}
            actions={orderByNameLinkedArticlesActions}
            target={
              <ActionIcon>
                {entitiesOrderBy?.desc ? (
                  <IconSortDescending size={24} />
                ) : (
                  <IconSortAscending size={24} />
                )}
              </ActionIcon>
            }
          />
          {selectedEntities.length > 0 && (
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <Button size="sm" compact radius="xl" variant="filled" mr={6}>
                  {selectedEntities.length}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={cancelSelection}>Cancel selection</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
      <ScrollArea>
        {items?.map(e => (
          <Group
            key={e.id + e.name}
            noWrap
            style={{
              cursor: "pointer"
            }}
            onClick={() => onClick(e)}
          >
            <Checkbox checked={!!selectedEntities.includes(e.id)} onChange={() => { }} />
            <Text
              size="sm"
              sx={{
                flex: 1,
                "&:hover": {
                  opacity: 0.5
                }
              }}
              title={e.name}
            >
              {e.name}
            </Text>
            {e.linkedArticles?.length && (
              <Tooltip position="left" label={`Linked articles (${e.linkedArticles?.length})`} withArrow>
                <Badge sx={{ background: "transparent" }}>
                  {e.linkedArticles?.length}
                </Badge>
              </Tooltip>
            )}
          </Group>
        ))}
      </ScrollArea>
    </>
  ) : null;
}
