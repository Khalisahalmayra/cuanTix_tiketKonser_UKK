export interface AdminEvent {
  id: number;
  title: string;
  city: string | null;
  start_at: string;
  status: string;
  categories: { name: string } | null;
  ticket_types: { price: number; quota: number; sold: number }[];
}

export interface SubmissionTicketType {
  id: number;
  name: string;
  price: number;
  quota: number;
}

export interface Submission {
  id: number;
  user_id: number;
  title: string;
  city: string | null;
  venue: string | null;
  start_at: string;
  status: string;
  created_at: string;
  poster_url?: string | null;
  banner_url?: string | null;
  users: {
    name: string;
    email: string;
  } | null;
  event_submission_ticket_types?: SubmissionTicketType[];
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  revisionSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

export interface AdminUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}
