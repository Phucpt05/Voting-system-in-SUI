import { FC, useRef } from "react";
import { Proposal } from "../../types";
import { ConnectButton, useCurrentWallet, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import {toast} from "react-toastify";

interface VoteModalProps{
  isOpen: boolean;
  onClose: () => void;
  hasVoted: boolean;
  proposal: Proposal;
  onVote: (votedYes: boolean ) => void
};

export const VoteModal: FC<VoteModalProps> = ({
  isOpen,
  onClose,
  hasVoted,
  proposal,
  onVote
}) => {
  const {connectionStatus} = useCurrentWallet();
  const {mutate: signAndExecute, isPending, isSuccess} = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable("packageId");
  const toastId = useRef<number| string>();

  if (!isOpen) return null;
  const showToast = (message: string) => toastId.current = toast(message);
  const dissmissToast = (message: string) =>{
    toast.dismiss(toastId.current);
    toast(message, {autoClose: 2000});
  };

  const vote = (voteYes: boolean )=>{
    // console.log("package id: " + packageId);
    // console.log("proposal id: " + proposal.id.id);
    // console.log("Voted yes: " + voteYes);
    const tx = new Transaction();
    tx.moveCall({
      arguments:[
        tx.object(proposal.id.id),
        tx.pure.bool(voteYes),
        tx.object("0x6")
      ],
      target: `${packageId}::proposal::vote`
    });
    showToast("Progressing Transaction");
    signAndExecute({
      transaction: tx
    },{
      onError: () =>{
        alert("Transaction failed");
        dissmissToast("Tx failed!")
      },
      onSuccess: async ({digest}) =>{
        const {effects} = await suiClient.waitForTransaction({
          digest,
          options: {
            showEffects: true
          }
        });
        console.log(effects);
        dissmissToast("Tx Successful!")
        onVote(voteYes);
      }
    });
  }

  const votingDisable = hasVoted || isPending || isSuccess;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full ">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold mb-4">{proposal.title}</h2>
          {hasVoted || isSuccess ? (
            <div className="w-14 text-sm p-1 font-medium rounded-full bg-green-100 text-gray-800 text-center">
              Voted
            </div>
          ) : <div className="w-24 text-sm p-1 font-medium rounded-full bg-red-100 text-gray-800 text-center">
            Not Voted
          </div>
          }
        </div>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{proposal.description}</p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>👍Yes votes: {proposal.voted_yes_count}</span>
            <span>👎No votes: {proposal.voted_no_count}</span>
          </div>
          <div className="flex justify-between gap-4">
            {connectionStatus === "connected" ?  <>
              <button
                disabled={votingDisable}
                className="flex-1 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                onClick={()=>vote(true)}
              >
                Vote Yes
              </button>
              <button
                disabled={votingDisable}
                className="flex-1 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                onClick={()=>vote(false)}
              >
                Vote No
              </button>
            </>: <ConnectButton connectText="Connect to vote"/>}
          </div>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};