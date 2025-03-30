export interface Event {
    id: string
    title: string
    description: string
    location: string
    startDate: Date
    endDate: Date
    createdAt: Date
    responsiblePerson?: Manager
  }
  export interface Manager {
    id: string
    firstname: string
    lastname: string
    email: string
    description?: string
    password?: string // Temporaire, pour l'envoi par email
  }