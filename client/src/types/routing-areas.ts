export interface RoutingArea {
  id: number;
  area: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deliver?: any;
}

export interface RoutingAreaForm {
  id?: number;
  area: string;
  deliverId: string
  status?: string;
}