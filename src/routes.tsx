import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';

const routes = [
  
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    }
  ];
  
  const router = createBrowserRouter(routes);
  
  export default router;