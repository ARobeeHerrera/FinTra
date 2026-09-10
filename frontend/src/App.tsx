import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./pages/ProtectedRoute"
import GetStarted from "./pages/GetStarted"
import AuthenticatedLayout from "./pages/AuthenticatedLayout"
import Transaction from "./pages/Transaction"
import Budget from "./pages/Budget"
import Goals from "./pages/Goals"
import Settings from "./pages/Settings"

function App() {
  return (
      <Routes>
        <Route path='/' element={<GetStarted/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route element={<ProtectedRoute><AuthenticatedLayout/></ProtectedRoute>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/transaction' element={<Transaction/>}/>
          <Route path='/budget' element={<Budget/>}/>
          <Route path='/goals' element={<Goals/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Route>
      </Routes>
  )
}

export default App
