import { RouterProvider, createBrowserRouter, createRoutesFromElements,Route } from "react-router-dom"
import StartPage from "./StartPage"
import LoginForm from "./components/LoginForm"
import RegistartionForm from "./components/RegistartionForm"
import User from "./components/User"



function App() {
   const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<StartPage/>}>
      <Route index element={<LoginForm/>}/>
      <Route path="/registartion" element={<RegistartionForm/>}/>
      <Route path="/user/:username" element={<User/>}/>
    </Route>
   ))

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App;
