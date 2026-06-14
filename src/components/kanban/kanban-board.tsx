'use client'

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useCallback } from 'react'
import { KanbanColumn } from './kanban-column'
import type { Status } from '@/lib/types'

export interface KanbanItem {
  id: string
  status_id: string | null
  kanban_position: number
}

interface Props<T extends KanbanItem> {
  statuses: Status[]
  items: T[]
  onReorder: (updates: { id: string; status_id: string | null; kanban_position: number }[]) => Promise<void>
  renderCard: (item: T, isDragging?: boolean) => React.ReactNode
}

export function KanbanBoard<T extends KanbanItem>({ statuses, items, onReorder, renderCard }: Props<T>) {
  const [localItems, setLocalItems] = useState<T[]>(items)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const activeItem = activeId ? localItems.find((i) => i.id === activeId) : null

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }, [])

  const handleDragOver = useCallback(({ active, over }: DragOverEvent) => {
    if (!over) return
    const overId = over.id as string
    const activeItem = localItems.find((i) => i.id === active.id)
    if (!activeItem) return

    const overStatus = statuses.find((s) => s.id === overId)
    const overItem = localItems.find((i) => i.id === overId)
    const targetStatusId = overStatus?.id ?? overItem?.status_id

    if (!targetStatusId || activeItem.status_id === targetStatusId) return

    setLocalItems((prev) =>
      prev.map((i) => (i.id === active.id ? { ...i, status_id: targetStatusId } : i))
    )
  }, [localItems, statuses])

  const handleDragEnd = useCallback(async ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over) return

    const overId = over.id as string
    const activeIdx = localItems.findIndex((i) => i.id === active.id)
    const overIdx = localItems.findIndex((i) => i.id === overId)

    let reordered = localItems
    if (activeIdx !== overIdx && overIdx !== -1) {
      reordered = arrayMove(localItems, activeIdx, overIdx)
    }

    setLocalItems(reordered)

    const updates = reordered.map((item, idx) => ({
      id: item.id,
      status_id: item.status_id,
      kanban_position: idx,
    }))

    await onReorder(updates)
  }, [localItems, onReorder])

  const itemsByStatus = statuses.reduce<Record<string, T[]>>((acc, s) => {
    acc[s.id] = localItems
      .filter((i) => i.status_id === s.id)
      .sort((a, b) => a.kanban_position - b.kanban_position)
    return acc
  }, {})

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {statuses.map((status) => {
          const columnItems = itemsByStatus[status.id] ?? []
          return (
            <KanbanColumn
              key={status.id}
              id={status.id}
              title={status.name}
              color={status.color}
              count={columnItems.length}
              itemIds={columnItems.map((i) => i.id)}
            >
              {columnItems.map((item) => renderCard(item))}
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeItem ? (
          <div className="rotate-2 scale-105 opacity-95 shadow-2xl">
            {renderCard(activeItem, true)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
