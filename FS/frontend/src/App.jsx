import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
    .then((res) => (
      setJokes(res.data)
    ))
    .catch( (err) => (
      console.log(err)      
    ))
})


  return (
    <>
      <h1>
        Full Stack Jokes
      </h1>

      <p>{jokes.length}</p>
      {
        jokes.map( (joke) => (
          <div key={joke.id}>
            <p>{joke.title}</p>
            <h2>{joke.content}</h2>
          </div>
        ))
      }
    </>
  )
}

export default App
