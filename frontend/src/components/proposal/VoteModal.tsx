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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
        <div className="flex justify-between items-start mb-5">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{proposal.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">{proposal.description}</p>
        
        <div className="flex flex-col gap-5">
          {/* Vote counts display */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              <span className="mr-1.5">👍</span>
              <span className="font-semibold">{proposal.voted_yes_count} Yes</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
              <span className="mr-1.5">👎</span>
              <span className="font-semibold">{proposal.voted_no_count} No</span>
            </div>
          </div>
          
          {/* Voting status indicator */}
          <div className="text-center">
            {hasVoted || isSuccess ? (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You have already voted</span>
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Cast your vote</span>
              </div>
            )}
          </div>
          
          {/* Vote buttons */}
          <div className="flex justify-between gap-4">
            {connectionStatus === "connected" ?  <>
              <button
                disabled={votingDisable}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  votingDisable
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
                onClick={()=>vote(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Vote Yes
              </button>
              <button
                disabled={votingDisable}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  votingDisable
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
                onClick={()=>vote(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Vote No
              </button>
            </> :
              <div className="w-full">
                <ConnectButton connectText="Connect to vote" className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300" />
              </div>
            }
          </div>
          
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};