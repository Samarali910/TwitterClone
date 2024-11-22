import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const useFollow = () => {

    const queryClient = useQueryClient();

    const {mutate:follow,isPending,isError} = useMutation({
        mutationFn:async(userId)=>{
            const res = await fetch(`/api/user/followunfollow/${userId}`,{
                method:"POST"
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error || "Something went wrong")
            }
            if(data.error){
                throw new Error(data.error);
            }
            return data;
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:['suggestedUser']}),
                 queryClient.invalidateQueries({queryKey:['authUser']})
            ])
           
        },
        onError:(error)=>{
            throw new Error(error)
        },
         
    })
  return  {follow,isPending}
}

export default useFollow