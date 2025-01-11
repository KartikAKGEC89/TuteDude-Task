import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import MainPage from './components/MainPage'

const App = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/mainpage' element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
