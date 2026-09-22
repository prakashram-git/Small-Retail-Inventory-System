import Header from '@/components/Header';
import SettingsPage from '@/components/SettingsPage';

export const metadata = {
  title: 'Settings - RedHill Inventory Dashboard',
  description: 'Admin settings for RedHill inventory management system',
};

export default function SettingsRoute() {
  return (
    <>
      <Header />
      <SettingsPage />
    </>
  );
}
