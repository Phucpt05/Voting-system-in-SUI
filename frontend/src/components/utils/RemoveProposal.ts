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

      // Show pending toast
      const pendingToastId = toast.info("Removing proposal...", { autoClose: false });
      
      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: () => {
            // Update pending toast to success
            toast.update(pendingToastId, {
              render: "Proposal removed successfully!",
              type: "success",
              autoClose: 1500
            });
            if (onSuccess) onSuccess();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          },
          onError: (error) => {
            console.error("Error removing proposal:", error);
            // Update pending toast to error
            toast.update(pendingToastId, {
              render: "Failed to remove proposal. Please try again.",
              type: "error",
              autoClose: 3000
            });
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