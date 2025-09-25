import React from 'react'

const PROPOSAL_COUNT = 10;

const ProposalItem = () =>{
    return(
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors'> 
            <div className='text-xl font-semibold mb-2'>Title: Hello There</div>
            <div className='text-gray-700 dark:text-gray-400'>Desc: What is your vote ?</div>
        </div>
    )
}

const ProposalView = () => {
  return (
    <>
        <h1 className='text-4xl font-bold mb-8'>New Proposals </h1>
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-6'>
            {new Array(PROPOSAL_COUNT).fill(1).map((id) => (
                <ProposalItem key={id * Math.random()} />
            ))}
        </div>
    </>

  )
}

export default ProposalView