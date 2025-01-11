import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../pages/Root.jsx";
import QuestionPage from "../pages/QuestionPage.jsx";
import PrivateRoute from "../context/PrivateRoute.jsx";
import LandingPage from "../pages/Landing.jsx";
import SavedQuestions from "../components/SavedQuestions.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import SharedQuestionPage from "../pages/SharedQuestionPage.jsx";
import Preparation from "../pages/Preparation.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import Revision from "../pages/Revision.jsx"

import TermsAndConditions from "../pages/T&C.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import Contact from "../pages/Contact.jsx";

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
          path:"/onboarding",
          element: (
            <PrivateRoute>
              <Onboarding />
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
        {
          path:"/prep",
          element: (
            <PrivateRoute>
              <Preparation />
            </PrivateRoute>
          ),
        },
        {
          path:"/rev",
          element:(
            <PrivateRoute>
              <Revision />
            </PrivateRoute>
          )
        }
      ],
    },
    {
      path:"/terms-and-conditions",
      element: <TermsAndConditions />
    },
    {
      path:"/privacy-policy",
      element: <PrivacyPolicy />
    },
    {
      path:"/contact",
      element: <Contact />
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
