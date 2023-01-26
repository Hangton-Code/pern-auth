import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { IUser } from "../type";

function GoogleRedirectPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const userString = query.get("user");
    const access_token = query.get("access_token");
    const refresh_token = query.get("refresh_token");

    if (userString && access_token && refresh_token) {
      const user = JSON.parse(userString) as IUser;
      googleLogin(refresh_token, access_token, user);
    }
    navigate("/");
  }, []);

  return <></>;
}

export default GoogleRedirectPage;
