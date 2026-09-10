import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountQueryOptions, meQueryOptions } from "../api/queries";
import { Wallet } from "lucide-react";
import type { AxiosError } from "axios";
import { formattedDate } from "../constant/constants";
import { useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { createAccountMutation } from "../api/mutations";
import { MutatingDots } from "react-loader-spinner";

function Dashboard() {
  const queryClient = useQueryClient();
  const { data: accountData, isLoading: accountIsLoading, isError: accountIsError, error: accountError} = useQuery(accountQueryOptions);
  const { data: userData, isLoading: userIsLoading } = useQuery(meQueryOptions);
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  
  console.log(accountData);

  const [ name, setName ] = useState('');
  const [ currency, setCurrency ] = useState('PHP');

  const { mutate: createAccount, isPending } = useMutation({
    ...createAccountMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts']});
      setIsModalOpen(false);
    }
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createAccount({ name, currency})
  };

  if (accountIsLoading) {
    return <div className='grid place-items-center h-dvh'><OrbitProgress dense color="#ececec" size="large" text="loading" textColor="#000000" /></div>
  }

  if (accountIsError) {
    const axiosError = accountError as AxiosError
    if (axiosError.response?.status === 404) {
      return (
        <div className="flex flex-col items-center justify-center h-dvh gap-4">
          <p className='text-2xl font-semibold'>You don't have an account yet.</p>
          <button className='w-40 h-20 bg-green-100 rounded-2xl' onClick={() => setIsModalOpen(true)}>
            Create Account
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 w-96">
                <h2 className="text-xl font-bold mb-4">Create Your Account</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                  <div>
                    <label className='flex text-sm font-medium mb-2'>Account Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded-2xl px-3 py-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className='flex text-sm font-medium mb-2'>Account Name</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="border rounded-2xl px-3 py-2 w-full"
                    >
                      <option value='PHP'>PHP</option>
                      <option value='USD'>USD</option>
                      <option value='SGD'>SGD</option>
                      <option value='JPY'>JPY</option>
                    </select>
                  
                  </div>
                  <button type='submit' disabled={isPending} className='bg-green-600 text-white rounded-2xl py-2'>
                    {isPending ? 
                    <MutatingDots
                      visible={true}
                      height="100"
                      width="100"
                      color="#4fa94d"
                      secondaryColor="#4fa94d"
                      radius="12.5"
                      ariaLabel="mutating-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      /> 
                      : 'Create Account'}
                  </button>
                </form>
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )
    }
    return <div>Something went wrong. Please try again.</div>
  }

  return (
    <>
      {/* Top most part */}
      <div className='flex flex-col w-full h-24 py-6 px-10 bg-white'>
        <span className='text-2xl text-[#111827] font-bold'>
          Welcome Back, {userIsLoading ? '...' : `${userData.firstName}`}
        </span>
          <p className='text-[#6b7280] font-normal'>{formattedDate}, Here's your financial overview</p>
      </div>
 
      {/* Overview */}
      <div className='grid grid-cols-4 gap-12 my-8 mx-10'>
        <div className ='bg-linear-to-r from-[#34c759] to-[#058c27] h-44  text-white rounded-xl p-6  shadow'>
          <div className='flex items-center'>
            <p className='text-white/85 font-medium text-base'>Total Balance </p>
            <Wallet size={38} strokeWidth={2} className='bg-white/25 rounded-full ml-40 p-2'/>
          </div> 
        </div>
        <div className ='bg-white h-44 text-white rounded-xl p-6 shadow'></div>
        <div className ='bg-white h-44 text-white rounded-xl p-6 shadow'></div>
        <div className ='bg-white h-44 text-white rounded-xl p-6 shadow'></div>
      </div>
    </>
  )
}

export default Dashboard;