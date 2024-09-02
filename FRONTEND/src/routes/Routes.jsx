import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../pages/Root.jsx";
import QuestionPage from "../pages/QuestionPage.jsx";
import PrivateRoute from "../context/PrivateRoute.jsx";
import LandingPage from "../pages/Landing.jsx";
const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/home",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path:"/home/question/:id",
          element:(
            <PrivateRoute>
              <QuestionPage />
            </PrivateRoute>
          )
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
