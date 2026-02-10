import { Redirect } from 'expo-router';

// Redirects legacy or invalid /auth links to the supported login route.
export default function AuthRedirect() {
  return <Redirect href="/login" />;
}