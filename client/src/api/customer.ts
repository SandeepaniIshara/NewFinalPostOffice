import type { CustomerForm, Customer } from "@/types/customer";
import apiClient from ".";

export const getCustomers = async (): Promise<{ customers: Customer[] }> => {
  const response = await apiClient.get("/customer");
  return response.data as { customers: Customer[] };
};

export const getSearchCustomers = async ({
  query,
}: {
  query: string;
}): Promise<{ customers: Customer[] }> => {
  const response = await apiClient.get("/customer", {
    params: { q: query, status:"ACTIVE" },
  });
  return response.data as { customers: Customer[] };
};

export const createCustomer = async ({
  firstName,
  lastName,
  email,
  contactNum,
  address,
}: CustomerForm) => {
  const response = await apiClient.post("/customer", {
    firstName,
    lastName,
    email,
    contactNum,
    address,
  });
  return response.data as Customer;
};

export const updateCustomer = async ({
  id,
  firstName,
  lastName,
  email,
  contactNum,
  address,
  status
}: CustomerForm & { id: string }) => {
  const response = await apiClient.put(`/customer/${id}`, {
    firstName,
    lastName,
    email,
    contactNum,
    address,
    status
  });
  return response.data as Customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await apiClient.delete(`/customer/${id}`);
};
