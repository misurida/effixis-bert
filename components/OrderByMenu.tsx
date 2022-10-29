import { Button, Menu } from '@mantine/core'
import { IconCheck, IconChevronDown } from '@tabler/icons'
import { OrderBy } from '../utils/types'

export interface OrderByAction {
  label: string
  title?: string
  prop: string
  desc: boolean
  type?: 'date'
}

export default function OrderByMenu(props: {
  actions: OrderByAction[]
  prop?: string
  desc?: boolean
  onOrderBy: (orderBy?: OrderByAction) => void
  target?: React.ReactNode
}) {

  const onOrderBy = (i: number) => {
    const a = props.actions[i]
    const prop = a.prop
    const desc = a.desc
    if (prop === props?.prop && desc === props.desc) {
      props.onOrderBy(undefined)
    }
    else {
      props.onOrderBy(a)
    }
  }

  const buttonLabel = () => {
    const action = props.actions.find(a => a.prop === props.prop && a.desc === props.desc)
    if (props.prop && action) {
      return (
        <span title={action.title || action.label}>
          <span>{action?.label}</span> <span style={{ opacity: 0.5, fontSize: "0.8em" }}>{action?.desc ? "▼" : "▲"}</span>
        </span>
      )
    }
    return "Sort by"
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {props.target ? props.target : (
          <Button
            variant='light'
            color="gray"
            rightIcon={<IconChevronDown size={16} />}
          >
            {buttonLabel()}
          </Button>
        )}
      </Menu.Target>
      <Menu.Dropdown>
        {props.actions.map((a, i) => (
          <Menu.Item
            key={a.label + a.desc.toString()}
            onClick={() => onOrderBy(i)}
            icon={props.prop === a.prop && props.desc === a.desc ? <IconCheck size={16} color="gray" /> : undefined}
          >
            <span title={a.title || a.label}>{a.label} <span style={{ opacity: 0.25, fontSize: "0.8em" }}>{a.desc ? "▼" : "▲"}</span></span>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
