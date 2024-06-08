import { useState } from 'react'
import { BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
