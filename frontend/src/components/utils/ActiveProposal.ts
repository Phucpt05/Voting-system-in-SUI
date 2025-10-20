import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { toast } from "react-toastify";

// Types for better type safety
type ProposalStatus = "Active" | "Delisted";

type UseProposalManagementReturn = {
  changeProposalStatus: (proposalId: string, status: ProposalStatus) => void;
  isPending: boolean;
};

// Helper function to create and execute a transaction
const createTransaction = (
  proposalId: string,
  status: ProposalStatus,
  packageId: string,
  adminCapId: string
): Transaction => {
  const tx = new Transaction();
  
  // Determine which function to call based on the status
  const functionName = status === "Active" 
    ? "set_active_status" 
    : "set_delisted_status";
  
  // Call the appropriate function from the proposal module
  tx.moveCall({
    arguments: [
      tx.object(proposalId),
      tx.object(adminCapId),
    ],
    target: `${packageId}::proposal::${functionName}`,
  });
  
  return tx;
};

// Custom hook for managing proposal status
export const useProposalManagement = (): UseProposalManagementReturn => {
  const { mutate: signAndExecute, isPending, reset} = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("packageId");
  const adminCapId = useNetworkVariable("adminCapId");

  const changeProposalStatus = (
    proposalId: string, 
    status: ProposalStatus, 
    onSuccess?: () => void
  ) => {
    try {
      const tx = createTransaction(proposalId, status, packageId, adminCapId);
      
      const successMessage = status === "Active" 
        ? "Proposal activated successfully!" 
        : "Proposal delisted successfully!";
      
      const errorMessage = status === "Active" 
        ? "Failed to activate proposal. Please try again." 
        : "Failed to delist proposal. Please try again.";

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            reset();
            toast.success(successMessage);
            if(onSuccess) onSuccess();
          },
          onError: (error) => {
            console.error(`Error ${status}ing proposal:`, error);
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error(`Error preparing transaction to ${status} proposal:`, error);
      toast.error("Failed to prepare transaction. Please try again.");
    }
  };

  return {
    changeProposalStatus,
    isPending,
  };
};

// Convenience hooks for specific actions
export const useDelistProposal = () => {
  const { changeProposalStatus, isPending } = useProposalManagement();
  
  const delistProposal = (proposalId: string) => {
    changeProposalStatus(proposalId, "Delisted");
  };
  
  return { delistProposal, isPending };
};

export const useActivateProposal = () => {
  const { changeProposalStatus, isPending } = useProposalManagement();
  
  const activateProposal = (proposalId: string) => {
    changeProposalStatus(proposalId, "Active");
  };
  
  return { activateProposal, isPending };
};