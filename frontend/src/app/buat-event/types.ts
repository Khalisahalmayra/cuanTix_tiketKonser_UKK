export type Category = {
  id: number;
  name: string;
  slug?: string;
};

export type TicketTypeInput = {
  id: string;
  name: string;
  price: number | "";
  quota: number | "";
  sale_start: string;
  sale_end: string;
  description: string;
};

export type SubmissionSuccess = {
  id: number;
  title: string;
  status: string;
};

export type StepNumber = 1 | 2 | 3 | 4;

export type SummaryMetrics = {
  totalQuota: number;
  potentialRevenue: number;
};
