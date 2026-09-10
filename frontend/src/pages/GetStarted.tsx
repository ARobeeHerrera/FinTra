import { ArrowRight, ChartNoAxesColumnIncreasing, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();
  // <h1> Get Started Page</h1>
  // <button onClick={() => navigate('/login')}> Get Started </button>
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Column Part of the website */}
        <div className="w-full md:w-1/2 bg-white p-24">
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-sans font-semibold px-4 py-1.5 rounded-full">
            FinTra Finance Tracker
          </span>
          <h1 className="items-center gap-2 text-[#111827] text-6xl font-sans font-extrabold pt-9">
            Take control of your finances.
          </h1>
          <p className="items-center text-gray-500 text-xl font-sans font-medium mt-6">
            Track spending, income, and savings in one place clean, fast, and built for your financial clarity.
          </p>
          <ul className="list-none space-y-4 py-8">
            <li className="flex items-center gap-2">
              <Wallet size={40} strokeWidth={2} color="#34c759" className="bg-green-50 rounded-full p-2"/>
              <span className="font-sans text-lg text-gray-700">See your total balance and monthly trends at a glance</span> 
            </li>
            <li className="flex items-center gap-2">
              <ChartNoAxesColumnIncreasing size={40} strokeWidth={2} color="#34c759" className="bg-green-50 rounded-full p-2"/>
              <span className="font-sans text-lg text-gray-700">Understand spending by category and stay on top of your goals.</span> 
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={40} strokeWidth={2} color="#34c759" className="bg-green-50 rounded-full p-2"/>
              <span className="font-sans text-lg text-gray-700">Secure, simple, and designed for daily use.</span> 
            </li>
          </ul>

          <button className="flex items-center justify-center gap-2 self-center border-2 rounded-3xl p-5 h-20 w-full bg-[#34c759] hover:bg-green-600 text-white mt-62 mx-auto font-sans font-semibold text-2xl" onClick={() => navigate('/login')}>Get Started <ArrowRight/></button>
          <span className="flex mt-3 text-gray-400 font-medium font-sans text-base">No credit card required. Start tracking in minutes.</span>
        </div>
        {/* Right Colum Part of the website*/}
        <div className="w-full md:w-1/2 bg-[#14ae5c] p-24">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white">
            <span className="text-green-500 font-bold text-3xl">F</span>
          </div>
          <h1 className="text-4xl pt-4 text-white font-bold ">FinTra</h1>
          <p className="pt-1 text-white/80 text-base">Your money, organized.</p>

          <div className="flex items-center justify-center gap-2 w-2/3 h-2/3 rounded-2xl bg-white mt-3 mx-auto ">
            Preview Holder
          </div>
        </div>
      </div>
    </>
  )
}

export default GetStarted;