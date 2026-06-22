import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
