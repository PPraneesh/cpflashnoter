import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../pages/Root.jsx";
import QuestionPage from "../pages/QuestionPage.jsx";
import PrivateRoute from "../context/PrivateRoute.jsx";
import LandingPage from "../pages/Landing.jsx";
import SavedQuestions from "../components/SavedQuestions.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import SharedQuestionPage from "../pages/SharedQuestionPage.jsx";

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
          path: "/share/:cp_id",
          element: <SharedQuestionPage />,
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
          path: "/home/questions",
          element: (
            <PrivateRoute>
              <SavedQuestions />
            </PrivateRoute>
          ),
        },
        {
          path: "/home/questions/:id",
          element: (
            <PrivateRoute>
              <QuestionPage />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
