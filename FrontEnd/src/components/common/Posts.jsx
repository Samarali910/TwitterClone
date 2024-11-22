 import PostSkeleton from "../skeletons/PostSkeleton";
 
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const Posts = ({feedType,username,userId}) => {
	  console.log(userId);
	const isLoading = false;

	const getPostEndPoint = ()=>{
		switch(feedType){
			case "forYou":
				 return "/api/post/allpost";
		    case "following":
				return "/api/post/followpost";
		    case "posts":
				return `/api/post/getuserpost/${username}`
			case "likes":
				return `/api/post/likedpost/${userId}`			
			default:
				return "/api/post/allpost"	
		}
	}

	const POST_ENDPOINT = getPostEndPoint();

	   console.log(POST_ENDPOINT)


	 const {data:posts,isPending,refetch,isRefetching} = useQuery({
		queryKey:["posts"],
		queryFn: async ()=>{
			try {
				const res = await fetch(POST_ENDPOINT);
				 
				const data = await res.json();	

				 
				if(!res.ok){
					throw new Error(data.error || "somthing went wrong")
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		}
	 })

	     useEffect(()=>{
			refetch();
		 },[refetch,feedType])


	return (
		 <>
			{(isLoading || isRefetching)  && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;