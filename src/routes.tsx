import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import Teams from './pages/Teams.tsx';
import { About } from './pages/About.tsx';
import { SerieA } from './pages/SerieA.tsx';
import { SerieB } from './pages/SerieB.tsx';
import { Extintos } from './pages/Extintos.tsx';

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
          path: "/extintos",
          element: <Extintos />,
        },
      ],
    }
  ];
  
  const router = createBrowserRouter(routes);
  
  export default router;