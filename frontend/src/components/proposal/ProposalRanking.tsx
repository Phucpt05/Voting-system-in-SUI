import React, { FC, useState, useEffect } from 'react';
import { ProposalRankingItem } from './ProposalRankingItem';

interface ProposalRankingProps {
    proposalIds: string[];
    onProposalClick?: (proposalId: string) => void;
}

interface ProposalData {
    id: string;
    title: string;
    description: string;
    voted_yes_count: number;
    voted_no_count: number;
}

export const ProposalRanking: FC<ProposalRankingProps> = ({ proposalIds}) => {

    useEffect(() => {
        // This effect will be used to sort the proposals once they are loaded
        // The actual loading and sorting will be done by the parent component
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Rank
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Yes Votes
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            No Votes
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {proposalIds.map((proposalId, index) => (
                        <ProposalRankingItem
                            key={proposalId}
                            proposal_id={proposalId}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};