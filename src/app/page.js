import { redirect } from 'next/navigation';

export default function Home() {
  // Let the AuthContext in layout.js handle logic, but if this page lands, default redirect to /login
  redirect('/login');
}
