import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import Dashboard from './Features/Dashboard/Pages/Dashboard'
import NotFoundPage from './Features/NotFoundPage'

function App() {

  return (
 <BrowserRouter>
    {/* <ScrollToTop /> */}
    <Routes>
      {/* <Route path="/" element={<Index />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFoundPage />} />
      
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
