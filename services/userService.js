import instance from './api';

const BASE_URL = "/api/user";

export const getUserProfile = async (token, id) => {
  const response = await instance.get(`${BASE_URL}/me/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
