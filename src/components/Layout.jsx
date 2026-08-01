import Header from './Header';
import BottomBar from './BottomBar';

const Layout = ({ children, title, showBackButton = false, showSettings = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header title={title} showBackButton={showBackButton} showSettings={showSettings} />
      
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Layout;
