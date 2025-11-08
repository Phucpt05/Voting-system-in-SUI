import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { useQuery } from "@tanstack/react-query";

export const useIsAdmin = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const adminCapId = useNetworkVariable("adminCapId");
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount) return false;
      
      try {
        const object = await suiClient.getObject({
          id: adminCapId,
          options: { showOwner: true }
        });
        
        // Owner có thể là AddressOwner hoặc ObjectOwner
        const owner = object.data?.owner;
        if (owner && typeof owner === 'object' && 'AddressOwner' in owner) {
          return owner.AddressOwner === currentAccount.address;
        }
        
        return false;
      } catch (error) {
        console.error("Error checking admin ownership:", error);
        return false;
      }
    },
    enabled: !!currentAccount && !!adminCapId,
  });
  
  return { isAdmin: !!isAdmin, isLoading };
};