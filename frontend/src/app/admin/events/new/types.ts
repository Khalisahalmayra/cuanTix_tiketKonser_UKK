import { LucideIcon } from "lucide-react";

export type TicketItem = {
  id: string;
  name: string;
  price: number;
  quota: number;
  description: string;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  color: string;
};

export type SeatingZone = {
  id: string;
  name: string;
  ticketName: string;
  capacity: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "standing" | "seated";
};

export type SeatingPreset = "standing_seated" | "all_seated" | "festival_ground";

export type CategoryItem = {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

export type TicketPreset = {
  name: string;
  price: number;
  quota: number;
  color: string;
  description: string;
};

export type ZoneColor = {
  label: string;
  hex: string;
};

export type StepItem = {
  id: number;
  label: string;
  anchor: string;
};

export type DurationInfo = {
  text: string;
  durationText: string;
  isValid: boolean;
};
