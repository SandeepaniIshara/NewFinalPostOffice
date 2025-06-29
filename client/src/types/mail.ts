/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Mail {
  sender: any;
  receiver: any;
  routingArea: any;

  id: number;
  type: string;
  status: string;
  direction: string;
  receiverId: number;
  senderId: number;
}

export interface createMail {
  type: string;
  direction: string;
  receiverId: number;
  senderId: number;
}
