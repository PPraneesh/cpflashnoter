import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { loading, user } =useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return user ? children : null;
};



PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;