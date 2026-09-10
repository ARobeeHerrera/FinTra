import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRightLeft, Goal, LayoutDashboard, LogOut, NotebookPen, Settings } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { meQueryOptions } from "../api/queries";
import { logoutMutation } from "../api/mutations";

export default function AuthenticatedLayout() {
  const navigate = useNavigate()
  const { mutate: logout } = useMutation({
    ...logoutMutation,
    onSuccess: () => {
      navigate('/login')
    },
  });
  
  const { data, isLoading } = useQuery(meQueryOptions);
  return(
    <div className='flex min-h-screen'>
      {/* Sidebar background */}
      <aside className='w-64 bg-linear-to-b from-[#34c759] to-[#058c27]'>
        {/*Logo Placeholder*/}
        <div className='flex justify-center pt-8 pb-4 items-center gap-2'>
          <div className='flex items-center justify-center w-8 h-8 bg-white/25 rounded-md '>
            <span className='font-bold text-base text-white'>
              F
            </span>
          </div>
          <span className='text-xl font-bold text-white'>FinTra</span>
        </div>
        {/* Image Placeholder*/}
        <div className='flex flex-col items-center'>
          <div className='flex items-center justify-center w-18 h-18 bg-white rounded-full'>
            <span className='text-black text-xs'>Image</span>
          </div>
        </div> 

        {/* Name Placeholder */}
        <div className='flex flex-col items-center pt-1'>
          <span className='text-white text-base font-semibold'>{isLoading ? '...' : `${data?.firstName} ${data?.lastName}`}</span>
        </div>

        <hr className='mt-8 text-white/25'/>
        
        <div className='flex flex-col items-baseline m-4'>
          <ul className='list-none space-y-2 w-full'>
            <li>
             <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center justify-start gap-2 text-white text-sm px-4 py-3 rounded-lg w-full ${
                  isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            </li>
            <li>
             <NavLink
              to="/transaction"
              className={({ isActive }) =>
                `flex items-center justify-start gap-2 text-white text-sm px-4 py-3 rounded-lg w-full ${
                  isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              <ArrowRightLeft size={18} />
              Transaction
            </NavLink>
            </li>
            <li>
             <NavLink
              to="/budget"
              className={({ isActive }) =>
                `flex items-center justify-start gap-2 text-white text-sm px-4 py-3 rounded-lg w-full ${
                  isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              <NotebookPen size={18} />
              Budget
            </NavLink>
            </li>
            <li>
             <NavLink
              to='/goals'
              className={({ isActive }) =>
                `flex items-center justify-start gap-2 text-white text-sm px-4 py-3 rounded-lg w-full ${
                  isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              <Goal size={18} />
              Goals
            </NavLink>
            </li>
          </ul>
          <div className='flex mt-120'>
            <span className='flex ml-4 text-white'>
              <NavLink
              to='/settings'
              className='flex items-center gap-2'
              >
                <Settings size={18}/>
                Settings
              </NavLink>
            </span>
          </div>
          <div className='flex mt-2'>
            <span className='flex ml-4 text-white'>
              <button className='flex items-center gap-2' onClick={() => logout()}>
                  <LogOut size={18}/>
                  Logout
              </button>
            </span>
          </div>
        </div>
      </aside> 
      
       <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}