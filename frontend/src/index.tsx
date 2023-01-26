import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider, { useUser } from "./AuthProvider";
import GoogleRedirectPage from "./Pages/GoogleRedirectPage";
import CredentialsPage from "./Pages/Credentials/CredentialsPage";
import LoginPage from "./Pages/Credentials/LoginPage";
import SignupEmailPage from "./Pages/Credentials/SignupEmailPage";
import SignupPage from "./Pages/Credentials/SignupPage";
import ForgotPasswordPage from "./Pages/Credentials/FogotPasswordPage";
import SetPasswordPage from "./Pages/Credentials/SetPasswordPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <AuthProvider>
      <RouteController />
    </AuthProvider>
  </Router>
);

function AuthedRoutes() {
  const { refreshToken } = useUser();

  return !!refreshToken ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/credentials/login" />
  );
}
function UnAuthedRoutes() {
  const { refreshToken } = useUser();

  return !!!refreshToken ? <Outlet /> : <Navigate to="/" />;
}
function RouteController() {
  const { isReady } = useUser();

  return isReady ? (
    <Routes>
      <Route path="" element={<AuthedRoutes />}>
        <Route path="" element={<HomePage />} />
      </Route>
      <Route path="profile/:id" element={<ProfilePage />} />
      <Route path="auth/credentials" element={<CredentialsPage />}>
        <Route path="" element={<Navigate to="/" />} />
        <Route path="" element={<UnAuthedRoutes />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup_email" element={<SignupEmailPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot_password" element={<ForgotPasswordPage />} />
        </Route>
        <Route path="set_password" element={<SetPasswordPage />} />
      </Route>
      <Route path="auth/google" element={<UnAuthedRoutes />}>
        <Route path="redirect" element={<GoogleRedirectPage />} />
      </Route>
    </Routes>
  ) : (
    <></>
  );
}
