import { Outlet } from 'react-router-dom'
import Header from './Common/Header'
import { Footer } from './Common/Footer'
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
