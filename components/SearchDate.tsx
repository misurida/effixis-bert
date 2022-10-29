import { Box, Button, Group, NativeSelect, Popover, Stack } from '@mantine/core'
import { DatePicker, DateRangePicker } from '@mantine/dates'
import { IconChevronDown } from '@tabler/icons'
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { DateFilter } from '../utils/types';

export default function SearchDate(props: {
  dateFilter?: DateFilter
  onChange: (value?: DateFilter) => void
}) {

  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState<DateFilter["mode"]>('before')
  const [value, setValue] = useState<Date | null>(null);
  const [valueRange, setValueRange] = useState<[Date | null, Date | null]>([null, null])

  useEffect(() => {
    if (props.dateFilter?.mode) setMode(props.dateFilter.mode)
    if (props.dateFilter?.value) setValue(props.dateFilter.value)
    if (props.dateFilter?.valueRange) setValueRange(props.dateFilter.valueRange)
  }, [props.dateFilter])

  const onApply = () => {
    props.onChange({ mode, value, valueRange })
    setOpened(false)
  }

  const onCancel = () => {
    props.onChange(undefined)
    setMode("before")
    setValue(null)
    setValueRange([null, null])
    setOpened(false)
  }

  const buttonLabel = () => {
    if (props.dateFilter) {
      if (props.dateFilter.value && props.dateFilter.mode === "before") {
        return "< " + dayjs(props.dateFilter.value).format("DD.MM.YYYY")
      }
      if (props.dateFilter.value && props.dateFilter.mode === "after") {
        return "≥ " + dayjs(props.dateFilter.value).format("DD.MM.YYYY")
      }
      if (props.dateFilter.valueRange[0] && valueRange[1] && props.dateFilter.mode === "between") {
        return dayjs(props.dateFilter.valueRange[0]).format("DD.MM.YYYY") + " - " + dayjs(props.dateFilter.valueRange[1]).format("DD.MM.YYYY")
      }
    }

    return "Date filters"
  }

  return (
    <Box>
      <Popover opened={opened} onChange={setOpened}>
        <Popover.Target>
          <Button
            variant='light'
            color="gray"
            rightIcon={<IconChevronDown size={16} />}
            onClick={() => setOpened((o) => !o)}
          >
            {buttonLabel()}
          </Button>
        </Popover.Target>

        <Popover.Dropdown>
          <Stack spacing="xs">
            <NativeSelect
              data={['before', 'after', 'between']}
              placeholder="Select a mode"
              value={mode}
              onChange={(event) => setMode(event.currentTarget.value as DateFilter["mode"])}
            />
            {mode === "between" ? (
              <DateRangePicker
                placeholder="Pick date"
                value={valueRange}
                onChange={setValueRange}
              />
            ) : (
              <DatePicker
                placeholder="Pick date"
                allowFreeInput
                value={value}
                onChange={setValue}
              />
            )}
            <Group position="right" spacing="xs">
              <Button onClick={onCancel} variant='default' size="sm">Cancel</Button>
              <Button onClick={onApply} size="sm">Apply</Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}
