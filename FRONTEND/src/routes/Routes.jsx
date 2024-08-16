import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "about",
      element: <About />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
};

export default Routes;
