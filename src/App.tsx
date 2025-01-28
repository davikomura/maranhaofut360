import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/Common/Header'
import { Footer } from './components/Common/Footer'
// import { useLocation } from 'react-router-dom';

function App() {

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
