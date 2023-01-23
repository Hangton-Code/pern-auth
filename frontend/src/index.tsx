import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "./AuthProvider";
import GoogleRedirectPage from "./Pages/Google/GoogleRedirectPage";
import CredentialsPage from "./Pages/Credentials/CredentialsPage";
import LoginPage from "./Pages/Credentials/LoginPage";
import SignupEmailPage from "./Pages/Credentials/SignupEmailPage";
import SignupPage from "./Pages/Credentials/SignupPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="auth/credentials" element={<CredentialsPage />}>
          <Route path="" element={<Navigate to="/" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup_email" element={<SignupEmailPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route path="auth/google/redirect" element={<GoogleRedirectPage />} />
      </Routes>
    </AuthProvider>
  </Router>
);
