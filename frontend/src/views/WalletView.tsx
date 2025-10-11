// import { useQuery } from "@tanstack/react-query";
import { WalletStatus } from "../wallet/Status";

const WalletView = () => {
    // const { isPending, isFetching, data, error } = useQuery({
    //     queryKey: ['walletData'],
    //     queryFn: async () => {
    //         const response = await fetch('https://api.github.com/orgs/ORG/repos');
    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return data;
    //     }
    // });

    // if (isPending || isFetching) {
    //     <div>Loading...</div>
    // } else if (error) {
    //     <div>Error loading wallet data</div>
    // } else (
    return (
        <div className="mb-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Your Voting Wallet
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Manage your voting NFTs and track your participation in governance
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">Wallet Status</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                                    Connected to Sui Network
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Wallet Information</h2>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Wallet Status</h3>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <WalletStatus />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletView;