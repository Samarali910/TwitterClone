import { useState } from "react";
import { Link } from "react-router-dom";

 
import XSvg from "../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		userName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	 const {mutate,isError} = useMutation({
		mutationFn: async({userName,password})=>{
           try {
			 const res = await fetch('/api/auth/login',{
							method:'POST',
							headers:{
								"Content-type":"application/json"
							},
							body : JSON.stringify({userName,password})
						})
						const data = await res.json();
						 
						if(!res.ok){
							toast.error(data.error)
							throw new Error(date.error || "something went wrong")
						}
						if(data.error){
							throw new Error(data.error);
						}
		   } catch (error) {
			     throw new Error(error)
		   }
		},
		onSuccess:()=>{
			// toast.success("User logged in successfully")
			queryClient.invalidateQueries({queryKey:['authUser']})
		}
	 })

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData)
	};
                 
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	 

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='userName'
							name='userName'
							onChange={handleInputChange}
							value={formData.userName}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					 
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					 
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;