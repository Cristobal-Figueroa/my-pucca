import Header from './Header';
import ManBottomBar from './ManBottomBar';

const ManLayout = ({ children, title, showBackButton = false, showSettings = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header title={title} showBackButton={showBackButton} showSettings={showSettings} />
      
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      
      <ManBottomBar />
    </div>
  );
};

export default ManLayout;
