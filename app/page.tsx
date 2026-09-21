import Header from '@/components/Header';
import MetricsCard from '@/components/MetricsCard';
import LowStockTable from '@/components/LowStockTable';
import QuickActions from '@/components/QuickActions';
import RecentMovements from '@/components/RecentMovements';
import StocktakeModal from '@/components/StocktakeModal';
import BarcodeScanner from '@/components/BarcodeScanner';
import Toast from '@/components/Toast';
import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'RedHill Inventory Dashboard',
  description: 'Retail inventory management system for Singapore Central Mall',
};

export default function Dashboard() {
  return (
    <DashboardClient>
      <Header />
    </DashboardClient>
  );
}
