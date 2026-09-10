import { siGoogle } from "simple-icons";
import { backEndURL } from "../constant/constants";

function Login() {
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:1/2 bg-white p-24">
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-sans font-semibold px-4 py-1.5 rounded-full">
            FinTra Finance Tracker
          </span>
          <h1 className="text-[#111827] text-6xl font-sans font-extrabold mt-6">Welcome Back</h1>
          <p className="text-[#6b7280] mt-3 font-sans text-[18px]">Sign in to continue tracking your spending, income, and savings in one place</p>
          <div className="flex items-center gap-3 w-full h-20 border rounded-2xl border-gray-200 mt-6 p-2">
            <button className="flex border-2 rounded-4xl gap-2 p-4 ml-4" onClick={() => { window.location.href = `${backEndURL}/auth/google` }}> <svg className="h-6 w-6 " role="img" viewBox="0 0 24 24"><path d={siGoogle.path}></path></svg>Continue With Google</button>
            <p className="font-semibold text-base">Continue with Google</p>
          </div>
            <div className="flex items-center my-4">
              <div className="grow border-t border-[#9ca3af]"></div>
                <span className="shrink mx-4 text-[#9ca3af] font-medium">or sign in with email</span>
              <div className="grow border-t border-[#9ca3af]"></div>
          </div>
        </div>

        <div className="w-full md:1/2 bg-[#14ae5c]"></div>
      </div>

    </>
  )
}

export default Login;
