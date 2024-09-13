import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { loading, user } =useContext(AuthContext);
  const navigate = useNavigate();
  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user) {
    return children;
  }else{
    navigate("/")
  } 
};



PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;