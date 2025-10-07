import { useSuiClientQuery } from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client";
import { FC, useState } from "react"
import { Proposal } from "../../types";
import { VoteModal } from "./VoteModal";

type ProposalItemPros = {
    proposal_id: string,
}
export const ProposalItem: FC<ProposalItemPros> = ({ proposal_id }) => {
    const {isOpen, setIsOpen} = useState(false);
    const handleOnClick () =>{

    };

    const { data: dataResponse, isPending, error } = useSuiClientQuery(
        "getObject", {
        id: proposal_id,
        options: {
            showContent: true
        }
    }
    );
    if (isPending) return <div className='text-center text-gray-500'>Loading...</div>
    if (error) return <div className='text-center text-red-500'>Error: {error?.message}</div>
    if (!dataResponse || dataResponse.data?.content?.dataType != "moveObject") return <div className='text-center text-red-500'>Not Found</div>

    console.log(dataResponse.data);

    const proposal = parseProposal(dataResponse.data);
    if (!proposal?.title) return;
    debugger

    return (
        <>
            <div 
                className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors '
                onClick={}
                >
                <div className='text-xl font-semibold mb-2 break-all'>
                    Title: {proposal?.title || null}
                </div>
                <div className='text-gray-700 dark:text-gray-200'><strong className="mr-2">Des:</strong>{proposal?.description}</div>
                <div className="mt-2">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-4 items-center">
                            <div className='flex items-start text-green-600 mr-5'>
                                <span>👍</span>{proposal?.voted_yes_count}
                            </div>
                            <div className='flex items-start text-red-600'>
                                <span>👎</span>{proposal?.voted_no_count}
                            </div>
                        </div>
                        <div className='text-gray-700 dark:text-gray-500'>
                            {formatUnixTime(proposal?.expiration)}
                        </div>
                    </div>
                </div>
            </div>
            <VoteModal isOpen={isOpen} onClose/>
        </>
    )
}
function parseProposal(data: SuiObjectData): Proposal | null {
    if (data.content?.dataType !== "moveObject") return null;

    const { voted_yes_count, voted_no_count, expiration, ...rest } = data.content.fields as any;
    return {
        ...rest,
        voted_yes_count: Number(voted_yes_count),
        voted_no_count: Number(voted_no_count),
        expiration: Number(expiration),
    }
}

function formatUnixTime(timestampSec: number) {
    return new Date(timestampSec * 1000).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
}