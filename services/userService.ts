import  api  from './api';

export interface UserProfile {
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: string;
  preferences?: {
    currency?: string;
    theme?: string;
  };
  createdAt?: string;
  lastLogin?: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await api.put('/auth/me', updates);
  return response.data;
};