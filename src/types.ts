export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  niche: string;
  source: string;
  created_at: string;
}

export interface Booking {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}