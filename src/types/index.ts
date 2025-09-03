export interface Ticket {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  ticket_name: string
  ticket_description: string
  price: string
  capacity: number
  start_sale_date: string
  end_sale_date: string
  status: "available" | "sold_out" | "discontinued"
  event: number
}

export interface Venue {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  street_address: string
  city: string
  state_province: string
  postal_code: string
  country: string
}

export interface Event {
  id: number
  venue: Venue
  organizer: {
    member_ID: string
  }
  media: any[]
  created_at: string
  updated_at: string
  is_active: boolean
  title: string
  description: string
  start_date: string
  end_date: string
  status: "planned" | "ongoing" | "completed" | "cancelled"
  registration_deadline: string
  event_type: string
  reminder_time: string
}

export interface Fee {
  id: number
  membership_type: {
    name: string
    id: number
  }
  created_at: string
  updated_at: string
  is_active: boolean
  fee: string
  event: number
}