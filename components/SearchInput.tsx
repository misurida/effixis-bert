import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons";
import { useEffect, useState } from "react"

export default function SearchInput(props: {
  value: string
  onChange: (value: string) => void
  delay?: number
  noMatch?: boolean
}) {

  const [query, setQuery] = useState(props.value)

  useEffect(() => {
    const timer = setTimeout(() => props.onChange(query), props.delay || 500)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, props.delay])

  return (
    <TextInput
      placeholder="Search..."
      value={query}
      error={props.noMatch}
      rightSection={
        <ActionIcon onClick={() => setQuery("")}>
          {query ? (
            <IconX size={16} />
          ) : (
            <IconSearch size={16} />
          )}
        </ActionIcon>
      }
      onChange={(event) => setQuery(event.currentTarget.value)}
    />
  )
}
