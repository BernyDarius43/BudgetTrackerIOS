import { useAuth } from '@/context/authContext/authContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { userLoggedIn } = useAuth();
  
  // Direct users based on auth state
  if (userLoggedIn) {
    return <Redirect href="/(auth)/home-user" />;
  }
  
  return <Redirect href="/home" />;
}