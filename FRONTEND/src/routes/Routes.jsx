import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../pages/Root.jsx";
import QuestionPage from "../pages/QuestionPage.jsx";
import PrivateRoute from "../context/PrivateRoute.jsx";
import LandingPage from "../pages/Landing.jsx";
import SavedQuestions from "../pages/SavedQuestions.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import SharedQuestionPage from "../pages/SharedQuestionPage.jsx";
import Preparation from "../pages/Preparation.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import Revision from "../pages/Revision.jsx"
import Analytics from "../pages/Analytics.jsx";
import TermsAndConditions from "../pages/T&C.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import Contact from "../pages/Contact.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Generation from "../pages/Generation.jsx";

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
          path: "/generation",
          element: (
            <PrivateRoute>
              <Generation />
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
        },
        {
          path:"/analytics",
          element:(
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          )
        },
        {
          path:"/home",
          element: (
            <PrivateRoute>
              <Dashboard short={true} />
            </PrivateRoute>
          ),
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
