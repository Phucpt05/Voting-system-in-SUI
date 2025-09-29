import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import SuiObjects from './SuiObjects';

function OwnedObject() {
  const account = useCurrentAccount();
  const { data: response, isPending, error } = useSuiClientQuery(
    'getOwnedObjects', 
    { owner:  account?.address as string,
      options: {
      showType: true,
      showOwner: true,
      showContent: true,
    }
    },
    {enabled: !!account},
  );

  if(!account) return "Cannot retrieve account";
  if(error) return <div className='text-red-500'>Error: {error.message}</div>;
  if(isPending || !response) return <div className='text-center text-gray-500'>Loading...</div>;
  return (
    <div className='flex flex-col my-4 space-y-4'>
      {
        response.data.length === 0 ? (
          <p className='text-gray-700 dark:text-gray-300'>No object owned by connected wallet</p>
        ):(
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Object owned by connected wallet 
          </h2>
        )
      }
      <div className='space-y-2'>
        {
          response.data.map(objectRes =>(
            <SuiObjects key={objectRes.data?.objectId} objectRes={objectRes}/>
          ))
        }
      </div>

    </div>
  )
}

export default OwnedObject