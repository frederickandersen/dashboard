import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) {
    console.error('CLICKUP_API_TOKEN is not configured in environment variables')
    return res.status(500).json({ 
      error: 'API token not configured',
      details: 'Please add CLICKUP_API_TOKEN to your .env.local file'
    })
  }

  try {
    // Add pk_ prefix to the token
    const apiToken = `pk_${token}`
    console.log('Using token (first 13 chars):', apiToken.substring(0, 13))

    const teamsResponse = await axios.get('https://api.clickup.com/api/v2/team', {
      headers: {
        'Authorization': apiToken
      },
    })

    const teamId = teamsResponse.data.teams[0].id

    const listsResponse = await axios.get(`https://api.clickup.com/api/v2/team/${teamId}/list`, {
      headers: {
        'Authorization': apiToken
      },
    })

    const formattedLists = listsResponse.data.lists.map((list: any) => ({
      id: list.id,
      name: list.name,
    }))

    res.status(200).json(formattedLists)
  } catch (error: any) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.config?.headers
    })
    
    res.status(500).json({ 
      error: 'Failed to fetch lists', 
      details: error.response?.data || error.message 
    })
  }
}