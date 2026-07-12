import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import Dashboard from './pages/auth/DashboardPage'
// import NotFoundPage from './Features/NotFoundPage'
import Login from './pages/auth/LoginPage'
import Register from './pages/auth/register'

function App() {

  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* <Route path="/" element={<Index />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */}
    </BrowserRouter>
  )
}

export default App
