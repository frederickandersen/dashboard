import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { listId, timeframe = '30' } = req.query // Allow timeframe to be passed in
    const token = process.env.CLICKUP_API_TOKEN
    
    if (!listId) {
      return res.status(400).json({ error: 'List ID is required' })
    }

    if (!token) {
      return res.status(500).json({ error: 'API token not configured' })
    }

    const apiToken = `pk_${token}`

    // Calculate date range based on timeframe
    const now = Date.now()
    const days = parseInt(timeframe as string)
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000).getTime()

    const response = await axios.get(`https://api.clickup.com/api/v2/team/${process.env.CLICKUP_WORKSPACE_ID}/time_entries`, {
      headers: {
        'Authorization': apiToken
      },
      params: {
        start_date: startDate,
        end_date: now,
        custom_task_ids: 'true',
        include_task_tags: 'true',
        list_id: listId,
        assignee: '81774108, 81774107, 74615214, 81774106, 81774105, 81774104'
      }
    })

    console.log('Raw time entries:', response.data.data.slice(0, 2)) // Log first two entries
    
    // Group time entries by day
    const timeByDay = response.data.data.reduce((acc: Record<string, number>, entry: any) => {
      const date = new Date(entry.start).toLocaleDateString()
      const hours = (entry.duration || 0) / (1000 * 60 * 60)
      console.log(`Entry duration: ${entry.duration}ms = ${hours}h`)
      acc[date] = (acc[date] || 0) + hours
      return acc
    }, {})

    console.log('Time by day:', timeByDay)

    const totalTimeInHours = Object.values(timeByDay).reduce<number>((sum, hours) => sum + Number(hours), 0)
    const averageHoursPerDay = totalTimeInHours / Object.keys(timeByDay).length || 0

    res.status(200).json({
      timeTracked: totalTimeInHours,
      formattedTime: `${totalTimeInHours.toFixed(2)}h`,
      details: {
        timeframe: `Last ${days} days`,
        averagePerDay: `${averageHoursPerDay.toFixed(2)}h`,
        daysTracked: Object.keys(timeByDay).length,
        timeByDay
      }
    })
  } catch (error: any) {
    console.error('Error fetching time tracked:', error.response?.data || error)
    res.status(500).json({ 
      error: 'Failed to fetch time tracked',
      details: error.response?.data || error.message
    })
  }
}