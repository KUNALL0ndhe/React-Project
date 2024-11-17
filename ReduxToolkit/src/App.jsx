import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Addtodo from './components/Addtodo'
import Todos from './components/Todos'

function App() {

  return (
    <>
     <h1 className='text-white text-3xl'>
      <Addtodo />
      <Todos />
     </h1>
    </>
  )
}

export default App
