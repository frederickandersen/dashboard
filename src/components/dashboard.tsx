'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchTimeTracked, fetchClickUpLists, type ClickUpList } from '@/services/clickup-service'

interface TimeCard {
  id: string
  title: string
  selectedList: string
}

export function Dashboard() {
  // Initialize multiple cards with different titles
  const [cards] = useState<TimeCard[]>([
    { id: '1', title: 'Development Time', selectedList: '' },
    { id: '2', title: 'Design Time', selectedList: '' },
    { id: '3', title: 'Meeting Time', selectedList: '' },
    // Add more cards as needed
  ])

  const [selectedLists, setSelectedLists] = useState<Record<string, string>>({})

  const { data: lists = [], error: listsError } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchClickUpLists
  })

  if (listsError) return (
    <div className="min-h-screen p-8">
      <p className="text-lg text-red-500">Failed to load lists</p>
    </div>
  )

  // Create a function to handle list selection for each card
  const handleListSelect = (cardId: string, listId: string) => {
    setSelectedLists(prev => ({
      ...prev,
      [cardId]: listId
    }))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <TimeTrackingCard
            key={card.id}
            title={card.title}
            lists={lists}
            selectedList={selectedLists[card.id] || ''}
            onListSelect={(listId) => handleListSelect(card.id, listId)}
          />
        ))}
      </div>
    </div>
  )
}

interface TimeTrackingCardProps {
  title: string
  lists: ClickUpList[]
  selectedList: string
  onListSelect: (listId: string) => void
}

function TimeTrackingCard({ title, lists, selectedList, onListSelect }: TimeTrackingCardProps) {
  const { data: timeData, isLoading, error } = useQuery({
    queryKey: ['timeTracked', selectedList],
    queryFn: () => selectedList ? fetchTimeTracked(selectedList) : null,
    enabled: !!selectedList
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">
          {title}
        </CardTitle>
        <Select
          value={selectedList}
          onValueChange={onListSelect}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a list" />
          </SelectTrigger>
          <SelectContent>
            {lists.map((list) => (
              <SelectItem 
                key={list.id} 
                value={list.id}
              >
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-lg text-red-500 text-center py-8">
            Failed to load time data
          </p>
        )}
        {isLoading && (
          <p className="text-lg text-muted-foreground text-center py-8">Loading...</p>
        )}
        {timeData && (
          <div className="text-6xl font-bold text-center py-4">
            {timeData.formattedTime}
          </div>
        )}
        {!selectedList && (
          <p className="text-lg text-muted-foreground text-center py-8">
            Select a list to view time tracked
          </p>
        )}
      </CardContent>
    </Card>
  )
}