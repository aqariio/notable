import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Firebase";

const PrivateRoute = ({ element: Component }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
