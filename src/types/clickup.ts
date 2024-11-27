export interface ClickUpTeam {
  id: string
  name: string
}

export interface ClickUpList {
  id: string
  name: string
}

export interface ClickUpTimeEntry {
  start: number
  duration: number
  task?: {
    id: string
    name: string
    tags?: Array<{ name: string; tag_fg: string; tag_bg: string }>
  }
}

export interface ClickUpTimeEntriesResponse {
  data: ClickUpTimeEntry[]
} 