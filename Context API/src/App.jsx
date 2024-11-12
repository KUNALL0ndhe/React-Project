import React from "react"
import UserProviderContext from "./context/UserProviderContext"
import Login from "./components/Login/Login"
import Profile from "./components/Profile/Profile"

function App() {

  return (
    <UserProviderContext>
      <Login />
      <Profile />
    </UserProviderContext>
  )
}

export default App
