import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import Teams from './pages/Teams.tsx';
import { About } from './pages/About.tsx';
import { SerieA } from './pages/SerieA.tsx';
import { SerieB } from './pages/SerieB.tsx';
import { Champions } from './pages/Champions.tsx';
import TeamDetail from './pages/TeamDetail.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

const routes = [
  
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/teams",
          element: <Teams />,
        },
        {
          path: "/team/:id",
          element: <TeamDetail />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/serie-a",
          element: <SerieA />,
        },
        {
          path: "/serie-b",
          element: <SerieB />,
        },
        {
          path: "/campeoes",
          element: <Champions />,
        },
        {
          path: "/Teams",
          element: <Navigate to="/teams" replace />,
        },
        {
          path: "/About",
          element: <Navigate to="/about" replace />,
        },
        {
          path: "/Serie-A",
          element: <Navigate to="/serie-a" replace />,
        },
        {
          path: "/Serie-B",
          element: <Navigate to="/serie-b" replace />,
        },
        {
          path: "/Lista-de-campeoes",
          element: <Navigate to="/campeoes" replace />,
        },
      ],
    }
  ];
  
  const router = createBrowserRouter(routes);
  
  export default router;
