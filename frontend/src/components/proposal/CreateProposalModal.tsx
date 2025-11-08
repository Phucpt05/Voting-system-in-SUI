import { FC, useState, useRef } from "react";
import { ConnectButton, useCurrentWallet, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { toast } from "react-toastify";
import ProposalImageUpload from "./ProposalImageUpload";
import { WalrusResponse } from "../../types";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalCreated: () => void;
};

export const CreateProposalModal: FC<CreateProposalModalProps> = ({
  isOpen,
  onClose,
  onProposalCreated
}) => {
  const { connectionStatus } = useCurrentWallet();
  const { mutate: signAndExecute, isPending, isSuccess, reset } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("packageId");
  const dashboardId = useNetworkVariable("dashboardId");
  const toastId = useRef<number | string>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiration, setExpiration] = useState("");
  const [blobsId, setBlobsId] = useState("");

  if (!isOpen) return null;

  const showToast = (message: string) => toastId.current = toast(message);
  const dismissToast = (message: string) => {
    toast.dismiss(toastId.current);
    toast(message, { autoClose: 2000 });
  };

  const createProposal = () => {
    if (!title || !description || !expiration || !blobsId) {
      showToast("Please fill all fields and upload an image");
      return;
    }

    // Convert expiration date to timestamp (milliseconds)
    const expirationTimestamp = new Date(expiration).getTime();
    if (isNaN(expirationTimestamp) || expirationTimestamp <= Date.now()) {
      showToast("Please select a valid future date");
      return;
    }

    const tx = new Transaction();
    
    // Create proposal
    const proposalId = tx.moveCall({
      arguments: [
        tx.pure.string(title),
        tx.pure.string(description),
        tx.pure.u64(expirationTimestamp),
        tx.pure.string(blobsId),
      ],
      target: `${packageId}::proposal::create`
    });

    // Register proposal in dashboard
    tx.moveCall({
      arguments: [
        tx.object(dashboardId),
        proposalId,
      ],
      target: `${packageId}::dashboard::register_proposal`
    });

    showToast("Creating proposal...");
    signAndExecute({
      transaction: tx as any
    }, {
      onError: () => {
        alert("Transaction failed");
        dismissToast("Tx failed!");
      },
      onSuccess: async () => {
        dismissToast("Proposal created successfully!");
        onProposalCreated();
        // Don't call onClose() here since it will be handled by the parent component
        reset();
        // Reset form
        setTitle("");
        setDescription("");
        setExpiration("");
        setBlobsId("");
      }
    });
  };

  const isFormValid = title && description && expiration && blobsId && !isPending && !isSuccess;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
        <div className="flex justify-between items-start mb-5">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create New Proposal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter proposal title"
              disabled={isPending || isSuccess}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter proposal description"
              rows={3}
              disabled={isPending || isSuccess}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proposal Image
            </label>
            <ProposalImageUpload
              onUpload={(data: { info: WalrusResponse; mediaType: string }) => {
                const blobId = data.info.newlyCreated?.blobObject?.blobId || "";
                setBlobsId(blobId);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiration Date
            </label>
            <input
              type="datetime-local"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isPending || isSuccess}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {connectionStatus === "connected" ? (
            <>
              <button
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  !isFormValid
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
                onClick={createProposal}
              >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Proposal...
                </>
              ) : isSuccess ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Proposal Created!
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
            </>
          ) : (
            <div className="w-full">
              <ConnectButton connectText="Connect to create proposal" className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300" />
            </div>
          )}

          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-xl font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};