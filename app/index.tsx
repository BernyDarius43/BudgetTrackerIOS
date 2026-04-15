import { useAuth } from '@/context/authContext/authContext';
import { Redirect } from 'expo-router';
import { AuthBootstrapSkeleton } from '@/components/skeletons';

export default function Index() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <AuthBootstrapSkeleton />;
  }
  
  // Direct users based on auth state
  if (userLoggedIn) {
    return <Redirect href="/(auth)/home-user" />;
  }
  
  return <Redirect href="/home" />;
}
