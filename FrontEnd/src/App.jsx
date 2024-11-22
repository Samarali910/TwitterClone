import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
 import LoginPage from './pages/auth/LoginPage.jsx'
import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import  { Toaster } from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
function App() {

   const {data:authUser,isError,isLoading} = useQuery({
    queryKey:["authUser"],
    queryFn: async ()=>{
      try {
        const res = await fetch('/api/auth/me',{
          method:'POST',
          headers:{
            "Content-type":"application/json"
          },
        })
        const data = await res.json();
        
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }
        if(data.error){
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
         throw new Error(error)
      }
    },
    retry:false
   })

   if(isLoading){
     return (
      <div className='h-screen flex justify-center items-center'>
         <LoadingSpinner size='lg'/>
      </div>
     )
   }
  return (
    <>
    <div className='flex mx-w-6xl mx-auto'>
   {authUser && <Sidebar/>}
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>} />
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/'/>} />
        <Route path='/signup' element={!authUser ? <SignUpPage/>: <Navigate to='/'/>} />
        <Route path='/notification' element={ authUser ? <NotificationPage/> : <Navigate to='/login'/>} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>} />
      </Routes>
     {authUser && <RightPanel/>}
      <Toaster/>
    </div>
    </>
  )
}

export default App
