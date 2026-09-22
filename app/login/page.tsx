import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';

export const metadata = {
  title: 'Login - Mall Inventory System',
  description: 'Sign in to your inventory management account',
};

export default function LoginRoute() {
  return (
    <>
      <Header />
      <LoginPage />
    </>
  );
}
