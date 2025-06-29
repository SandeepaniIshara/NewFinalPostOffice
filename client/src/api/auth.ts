import apiClient from ".";

export const signupApi = async (
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  address: string,
  phoneNum: string,
  role: string,
  password: string,
  confirmPassword: string
) => {
  const response = await apiClient.post(`/auth/signup`, {
    firstName,
    lastName,
    username,
    email,
    address,
    phoneNum,
    role,
    password,
    confirmPassword,
  });
  return response.data;
};

export const signinApi = async (username: string, password: string) => {
  const response = await apiClient.post(`/auth/signin`, { username, password });
  return response.data;
};

export const signoutApi = async () => {
  const response = await apiClient.post(`/auth/signout`);
  return response.data;
};