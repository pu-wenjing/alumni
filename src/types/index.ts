export interface User {
  id: number
  name: string
  email: string
  avatar: string
  year: string
  department: string
  createdAt: string
}

export interface TimelineNode {
  id: string
  year: number
  title: string
  description: string
  icon: string
  color: string
  tags?: string[]
  images?: string[]
  hasCapsule?: boolean
  isActive?: boolean
}

export interface Capsule {
  id: number
  title: string
  content: string
  openDate: string
  recipients: string[]
  createdAt: string
  isOpened: boolean
}

export interface Alumni {
  id: number
  name: string
  avatar: string
  year: string
  department: string
  location: {
    lat: number
    lng: number
    city: string
  }
  distance: number
  online: boolean
}

export interface Theme {
  name: string
  label: string
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: string
  read: boolean
}
