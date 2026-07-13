/**
 * Shared types for Fever prototypes
 */

export type TabType = 'general' | 'mesas' | 'bono' | 'vip';

export interface TicketItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
}

export interface ZoneData {
  id: string;
  name: string;
  shortName: string;
  price: number;
  capacity: number;
  description: string;
  features: string[];
  color: string;
  image: string;
}

export interface QuantityState {
  [ticketId: string]: number;
}
