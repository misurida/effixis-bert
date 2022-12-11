import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions, NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import { ActionIcon, Badge, Box, Button, createStyles, Group, Loader, MantineTheme, Text, TextInput } from "@mantine/core";
import { IconChevronRight, IconFolder, IconFile, IconLink, IconSearch, IconX } from "@tabler/icons";


export interface TreeItem {
  id: number | string;
  parent: number | string | 0;
  text: string;
  droppable?: boolean;
  icon?: string
  color?: string
  number?: string
  link?: string | null
  numberOfArticles?: number
}

const useStyles = createStyles((theme: MantineTheme) => ({
  app: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "100%",
    "& ul": {
      listStyleType: "none",
      padding: "0 1em",
      margin: 0
    }
  },
  draggingSource: {
    opacity: 0.3
  },
  dropTarget: {
    backgroundColor: theme.colors.blue[1]
  },
  node: {
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    height: 32,
    paddingInlineEnd: 8,
  },
  isSelected: {
    color: theme.colors.blue[8]
  },
  expandIconWrapper: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    transition: "transform linear 0.1s",
    transform: "rotate(0deg)",
    transformOrigin: "center"
  },
  isOpen: {
    transform: "rotate(90deg)"
  },
  labelGridItem: {
    paddingInlineStart: 8,
  },
  dragPreview: {
    alignItems: "center",
    backgroundColor: theme.colors.blue[8],
    borderRadius: 4,
    boxShadow: "0 12px 24px -6px rgba(0, 0, 0, .25), 0 0 0 1px rgba(0, 0, 0, .08)",
    color: "#fff",
    display: "inline-grid",
    fontSize: 14,
    gap: 8,
    gridTemplateColumns: "auto auto",
    padding: "4px 8px",
    pointerEvents: "none",
  },
  icon: {
    alignItems: "center",
    display: "flex",
  },
  label: {
    alignItems: "center",
    display: "flex",
  },
  stickyPanel: {
    position: "sticky",
    top: 80,
    zIndex: 2
  }
}));



export const CustomNode = (props: {
  node: TreeItem
  depth: number
  isSelected: boolean
  isOpen: boolean
  onToggle: (id: string | number) => void
  onSelect: (node: TreeItem) => void
}) => {

  const { classes, cx } = useStyles()
  const { droppable } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleSelect = () => props.onSelect(props.node);
  const dragOverProps = useDragOver(props.node.id, props.isOpen, props.onToggle);

  return (
    <div className={cx(classes.node, { [classes.isSelected]: props.isSelected })}
      style={{ paddingInlineStart: indent }}
      onClick={handleSelect}
      {...dragOverProps}
    >
      <div className={cx(classes.expandIconWrapper, { [classes.isOpen]: props.isOpen })}>
        {props.node.droppable && (
          <ActionIcon size="sm" onClick={handleToggle}>
            <IconChevronRight size={16} />
          </ActionIcon>
        )}
      </div>
      <Group spacing={0} ml={4}>
        <TypeIcon droppable={droppable} icon={props.node.icon} />
        <Text title={props.node.id.toString()} className={classes.labelGridItem}>{props.node.text}</Text>
        <Badge ml="xs" size="sm" variant="outline">{props.node.numberOfArticles}</Badge>
        {props.node.link && (
          <ActionIcon size="sm" ml={5} onClick={() => props.node.link ? window.open(props.node.link) : null}>
            <IconLink size={14} />
          </ActionIcon>
        )}
      </Group>
    </div>
  );
};


export const CustomDragPreview = (props: {
  monitorProps: {
    item: any
  }
}) => {

  const { classes } = useStyles()

  return (
    <div className={classes.dragPreview}>
      <div className={classes.icon}>
        <TypeIcon droppable={props.monitorProps.item.droppable} icon={props.monitorProps.item?.fileType} />
      </div>
      <div className={classes.label}>{props.monitorProps.item.text}</div>
    </div>
  );
};


export const TypeIcon = (props: {
  droppable?: boolean
  icon?: string
}) => {
  return null
};


/**
 * Tree component wrapper based on react-dnd-treeview.
 * @see https://minop1205.github.io/react-dnd-treeview/?path=/docs/basic-examples-minimum-configuration--minimum-configuration-story
 */
export default function MantineTree(props: {
  data: TreeItem[]
  selectedItem?: TreeItem
  buttons?: React.ReactNode
  onSelect?: (node: TreeItem | null) => void
  onChange?: (items: TreeItem[]) => void
  onUpdate?: (items: TreeItem[]) => void
  stickyContent?: React.ReactNode
  initialOpen?: boolean
  loading?: boolean
}) {

  const { classes } = useStyles()
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeItem | null>(null);

  const ref = useRef(null);
  const handleOpenAll = () => {
    debugger;
    if (ref.current) (ref.current as any).openAll()
  }
  const handleCloseAll = () => {
    if (ref.current) (ref.current as any).closeAll()
  }

  useEffect(() => {
    setTreeData(props.data)
  }, [props.data])

  useEffect(() => {
    if (props.selectedItem !== undefined) {
      setSelectedNode(props.selectedItem)
    }
  }, [props.selectedItem])

  const handleSelect = (node: TreeItem) => {
    const item = node.id === selectedNode?.id ? null : node
    setSelectedNode(item)
    if (props.onSelect) {
      props.onSelect(item)
    }
  }

  const handleDrop = (newTree: TreeItem[]) => {
    setTreeData(newTree)
    if (props.onChange) {
      props.onChange(newTree)
    }
  }

  return (
    <Box>
      <Group mb="xs" spacing="xs">
        <Button compact variant="default" onClick={handleOpenAll}>Open full tree</Button>
        <Button compact variant="default" onClick={handleCloseAll}>Close full tree</Button>
        {props.buttons}
      </Group>
      <div className={classes.stickyPanel}>
        {props.stickyContent}
      </div>
      {props.loading ? (
        <Box px="md">
          <Loader />
        </Box>
      ) : (
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <div className={classes.app}>
            <Tree
              ref={ref}
              tree={treeData as any}
              rootId={0}
              sort={false}
              render={(node, { depth, isOpen, onToggle }) => (
                <CustomNode
                  node={node as TreeItem}
                  depth={depth}
                  isOpen={isOpen}
                  isSelected={node.id === selectedNode?.id}
                  onToggle={onToggle}
                  onSelect={handleSelect}
                />
              )}
              dragPreviewRender={(monitorProps) => (
                <CustomDragPreview monitorProps={monitorProps} />
              )}
              onDrop={val => handleDrop(val as TreeItem[])}
              canDrag={() => !!(props.onChange || props.onUpdate)}
              classes={{
                draggingSource: classes.draggingSource,
                dropTarget: classes.dropTarget
              }}
              initialOpen={props.initialOpen}
            />
          </div>
        </DndProvider>
      )}
    </Box>

  );
}

