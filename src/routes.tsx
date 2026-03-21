import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.tsx";
import { RouteLoader } from "./components/ui/RouteLoader";

const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const Teams = lazy(() => import("./pages/Teams.tsx"));
const About = lazy(() =>
  import("./pages/About.tsx").then((module) => ({ default: module.About }))
);
const SerieA = lazy(() =>
  import("./pages/SerieA.tsx").then((module) => ({ default: module.SerieA }))
);
const SerieB = lazy(() =>
  import("./pages/SerieB.tsx").then((module) => ({ default: module.SerieB }))
);
const Champions = lazy(() =>
  import("./pages/Champions.tsx").then((module) => ({ default: module.Champions }))
);
const TeamDetail = lazy(() => import("./pages/TeamDetail.tsx"));
const ContactPage = lazy(() =>
  import("./pages/ContactPage.tsx").then((module) => ({ default: module.ContactPage }))
);

const withLoader = (element: ReactNode) => (
  <Suspense fallback={<RouteLoader />}>{element}</Suspense>
);

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: withLoader(<HomePage />),
      },
      {
        path: "/teams",
        element: withLoader(<Teams />),
      },
      {
        path: "/team/:id",
        element: withLoader(<TeamDetail />),
      },
      {
        path: "/about",
        element: withLoader(<About />),
      },
      {
        path: "/contact",
        element: withLoader(<ContactPage />),
      },
      {
        path: "/serie-a",
        element: withLoader(<SerieA />),
      },
      {
        path: "/serie-b",
        element: withLoader(<SerieB />),
      },
      {
        path: "/campeoes",
        element: withLoader(<Champions />),
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
  },
];

const router = createBrowserRouter(routes);

export default router;
