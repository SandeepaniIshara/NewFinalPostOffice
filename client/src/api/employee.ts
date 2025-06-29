import type { Employee, EmployeeForm } from "@/types/employee";
import apiClient from ".";

export const getEmployees = async ({
  role,
  status,
}: {
  role: string;
  status: string;
}): Promise<{ employees: Employee[] }> => {
  const response = await apiClient.get("/employee", {
    params: {
      role,
      status,
    },
  });
  return response.data as { employees: Employee[] };
};

export const getSearchEmployee = async ({
  query,
  role,
}: {
  query: string;
  role?: string;
}): Promise<{ employees: Employee[] }> => {
  const response = await apiClient.get("/employee", {
    params: { q: query, status: "ACTIVE", role },
  });
  return response.data as { employees: Employee[] };
};

export const updateEmployee = async ({
  id,
  firstName,
  lastName,
  email,
  phoneNum,
  address,
  username,
  role,
  status,
}: EmployeeForm): Promise<Employee> => {
  const response = await apiClient.put(`/employee/${id}`, {
    firstName,
    lastName,
    email,
    phoneNum,
    address,
    username,
    role,
    status,
  });
  return response.data as Employee;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await apiClient.delete(`/employee/${id}`);
};
