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
        <>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Your Wallet Info</h1>
            </div>
            <div>
                <p>Wallet details will be displayed here.</p>
                <WalletStatus/>
            </div>
        </>
    );
};

export default WalletView;