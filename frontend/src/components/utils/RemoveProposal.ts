import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../../config/networkConfig";
import { toast } from "react-toastify";

export const useRemoveProposal = () => {
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("packageId");
  const adminCapId = useNetworkVariable("adminCapId");

  const removeProposal = async (proposalId: string, onSuccess?: () => void) => {
    try {
      const tx = new Transaction();
      
      // Call the remove function from the proposal module
      tx.moveCall({
        arguments: [
          tx.object(proposalId),
          tx.object(adminCapId),
        ],
        target: `${packageId}::proposal::remove`,
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            toast.success("Proposal removed successfully!");
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            console.error("Error removing proposal:", error);
            toast.error("Failed to remove proposal. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Error preparing transaction:", error);
      toast.error("Failed to prepare transaction. Please try again.");
    }
  };

  return {
    removeProposal,
    isPending,
  };
};