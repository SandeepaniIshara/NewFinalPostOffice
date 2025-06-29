/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Customer {
  [x: string]: any;
  id: number;
  fName: string;
  lName: string;
  email: string;
  contactNum: string;
  address: string;
  status: string;
}

export interface CustomerForm {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNum: string;
  address: string;
  status?: string;
}