import { useCurrentAccount } from "@mysten/dapp-kit"
import OwnedObject from "../components/OwnedObjects";

export const WalletStatus = () =>{
    const  account = useCurrentAccount();
    return (
        <div className="my-2 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-bold">Wallet Status</h2>
            {account ? (
                <div className="flex flex-col space-y-1">
                    <p>Wallet Connected</p>
                    <p className="text-gray-700 dark:text-gray-300 font-mono">Address: {account.address}</p>
                    <p className="text-gray-700 dark:text-gray-300 font-mono">Network: {account.chains}</p>
                </div>
            ) : (
                <p className="text-gray-700 dark:text-gray-300"><strong>No wallet connected</strong></p>
            )}
            <OwnedObject/>
        </div>
    )
}