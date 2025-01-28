import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import Teams from './pages/Teams.tsx';
import { About } from './pages/About.tsx';

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
      ],
    }
  ];
  
  const router = createBrowserRouter(routes);
  
  export default router;