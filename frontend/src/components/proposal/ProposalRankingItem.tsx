import { useSuiClientQuery } from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client";
import { FC } from "react"
import { Proposal } from "../../types";

interface ProposalRankingItemProps {
    proposal_id: string;
}

export const ProposalRankingItem: FC<ProposalRankingItemProps> = ({ proposal_id}) => {
    const { data: dataResponse, isPending, error } = useSuiClientQuery(
        "getObject", {
        id: proposal_id,
        options: {
            showContent: true
        }
    }
    );

    if (isPending) return null;
    if (error) return null;
    if (!dataResponse || dataResponse.data?.content?.dataType != "moveObject") return null;

    const proposal = parseProposal(dataResponse.data);
    if (!proposal?.title) return null;
    const index = 0;
    return (
        <tr 
            className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-150"
        >
            <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold">
                        {index + 1}
                    </span>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {proposal.title}
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {proposal.description}
                </div>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className="mr-1.5 text-green-500">👍</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {proposal.voted_yes_count}
                    </span>
                </div>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className="mr-1.5 text-red-500">👎</span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {proposal.voted_no_count}
                    </span>
                </div>
            </td>
        </tr>
    );
};

function parseProposal(data: SuiObjectData): Proposal | null {
    if (data.content?.dataType !== "moveObject") return null;

    const { voted_yes_count, voted_no_count, expiration, ...rest } = data.content.fields as any;
    return {
        ...rest,
        voted_yes_count: Number(voted_yes_count),
        voted_no_count: Number(voted_no_count),
        expiration: Number(expiration),
    };
}