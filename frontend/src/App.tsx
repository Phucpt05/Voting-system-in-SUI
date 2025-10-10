import React from "react";
import ProposalView from "./views/ProposalView";
import Navbar from "./components/Navbar";
import { useNavigation } from "./providers/theme/navigation/NavigationContext";
import WalletView from "./views/WalletView";
import { ToastContainer } from "react-toastify";

  const Pages = () => {
    const { currentPage } = useNavigation();
    const currentPages = currentPage;
    switch (currentPages) {
      case "/":
        return <ProposalView />;
      case "/wallet":
        return <WalletView />;
      default:
        return <div className="text-center">Page not found!</div>;
    }
  };


const App: React.FC = () => {
  return (
    <>
      <ToastContainer/>
      <div>
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <Navbar />
          <div className=" max-w-screen-xl m-auto pt-16">
            <Pages />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
