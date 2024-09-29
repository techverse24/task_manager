import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <p>Welcome to the home page! {user && user.name} </p>
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")}>Register</Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
