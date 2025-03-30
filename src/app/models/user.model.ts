export interface Manager {
    id: string
    firstname: string
    lastname: string
    email: string
    password?: string 
     role: "ADMIN" | "MANAGER" | "VOLUNTARY"
  }