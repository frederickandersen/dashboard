export interface ClickUpList {
    id: string
    name: string
  }
  
  export async function fetchClickUpLists() {
    try {
      const response = await fetch('/api/clickup/lists')
      if (!response.ok) throw new Error('Failed to fetch lists')
      return await response.json()
    } catch (error) {
      console.error('Error fetching ClickUp lists:', error)
      return []
    }
  }
  
  export async function fetchTimeTracked(listId: string) {
    try {
      const response = await fetch(`/api/clickup/time-tracked?listId=${listId}`)
      if (!response.ok) throw new Error('Failed to fetch time tracked')
      const data = await response.json()
      return {
        timeTracked: Number(data.timeTracked.toFixed(2)),
        formattedTime: `${data.timeTracked.toFixed(2)}h`,
        details: {
          timeframe: data.timeframe,
          averagePerDay: data.averagePerDay,
          daysTracked: data.daysTracked
        }
      }
    } catch (error) {
      console.error('Error fetching time tracked:', error)
      return null
    }
  }