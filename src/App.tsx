import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Common/Header'
import { Footer } from './Common/Footer'
import { useNavigatorLanguage } from './hooks/useNavigatorLanguage'
import { RouteLoader } from './components/ui/RouteLoader'

function App() {
  useNavigatorLanguage()

  return (
    <>
      <Header />
      <Suspense fallback={<RouteLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  )
}

export default App
