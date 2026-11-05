import { useState } from 'react'
import './App.css'
import CreateProfile from "./components/CreateProfile"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreateProfile/>
    </>
  )
}

export default App
