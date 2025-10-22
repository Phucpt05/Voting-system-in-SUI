import { SuiObjectResponse } from '@mysten/sui/client'
import { FC } from 'react'

type SuiObjectProp = {
    objectRes: SuiObjectResponse;
}

const SuiObjects: FC<SuiObjectProp> = ({objectRes}) => {
    const owner = objectRes.data?.owner;
    const objectType = objectRes.data?.type;
    const isCoin = objectType?.includes("0x2::coin::Coin");
    const balance = isCoin?(objectRes.data?.content as any).fields?.balance : -1;


    return (
        <div className='mb-5 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800'>
            <div key={`${objectRes.data?.objectId}-id`}>
                <p><strong>ObjectID:</strong> {objectRes.data?.objectId}</p>
            </div>
            <div key={`${objectRes.data?.objectId}-type`}>
                <p><strong>Type:</strong> {objectRes.data?.type}</p>
            </div>
            <div key={`${objectRes.data?.objectId}-owner`}>
                <p><strong>Owner:</strong>{typeof owner === "object" && owner !== null && "AddressOwner" in owner? owner.AddressOwner : "Unknown"}
                </p>
            </div>
            <div key={`${objectRes.data?.objectId}-balance`}>
                <p><strong>Balance:</strong>{balance}</p>
            </div>
        </div>
    )
}

export default SuiObjects