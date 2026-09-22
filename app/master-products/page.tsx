import Header from '@/components/Header';
import MasterProductsTable from '@/components/MasterProductsTable';

export const metadata = {
  title: 'Master Products - RedHill Inventory Dashboard',
  description: 'Complete master inventory table with all products',
};

export default function MasterProductsRoute() {
  return (
    <>
      <Header />
      <MasterProductsTable />
    </>
  );
}
