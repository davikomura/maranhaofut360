import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import Teams from './pages/Teams.tsx';
import { About } from './pages/About.tsx';
import { SerieA } from './pages/SerieA.tsx';
import { SerieB } from './pages/SerieB.tsx';
import { Champions } from './pages/Champions.tsx';
import TeamDetail from './pages/TeamDetail.tsx';

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
          path: "/Teams",
          element: <Teams />,
        },
        {
          path: "/team/:id",
          element: <TeamDetail />,
        },
        {
          path: "/About",
          element: <About />,
        },
        {
          path: "/Serie-A",
          element: <SerieA />,
        },
        {
          path: "/Serie-B",
          element: <SerieB />,
        },
        {
          path: "/Lista-de-campeoes",
          element: <Champions />,
        },
      ],
    }
  ];
  
  const router = createBrowserRouter(routes);
  
  export default router;