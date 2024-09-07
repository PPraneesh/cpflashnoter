import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../pages/Root.jsx";
import QuestionPage from "../pages/QuestionPage.jsx";
import PrivateRoute from "../context/PrivateRoute.jsx";
import LandingPage from "../pages/Landing.jsx";
import SavedQuestions from "../components/SavedQuestions.jsx";
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
        },{
          path:"/home/questions",
          element:(
            <PrivateRoute>
              <SavedQuestions />
            </PrivateRoute>
          )
        },
        {
          path:"/home/questions/:id",
          element:(
            <PrivateRoute>
              <QuestionPage />
            </PrivateRoute>
          )
        },
      ],
    },
    {
      path:"*",
      element: (<>
        <h1>Mess with this application its a beta version, and report it at dumb13305@gmail.com</h1>
      </>)
    }
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
