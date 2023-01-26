import { FormEvent, useState, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuth } from "../../AuthProvider";

function SetPasswordPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");
  const email = useMemo(() => {
    if (!token) return "false";
    try {
      return ((jwt_decode(token as string) as any).email as string) || "false";
    } catch {
      return "false";
    }
  }, [token]);

  const [newPassword, setNewPassword] = useState("");
  const newPasswordError = useMemo(() => {
    if (newPassword.length < 8 || newPassword.length > 30) {
      return "*must contain 8 to 30 characters";
    }
    return "";
  }, [newPassword]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setPassword } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setPassword(newPassword, token as string).then((err) => {
      if (err) {
        setIsLoading(false);
        setError(err);
      } else {
        setError("");
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    });
  };

  if (!token || email === "false") return <Navigate to="" />;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center p-[6%]">
      <form
        onSubmit={onFormSubmit}
        className="w-full max-w-sm flex flex-col justify-center gap-4"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-3xl leading-relaxed text-slate-800">
            Set Password
          </span>
          <span className="text-sm text-slate-500 mb-2">
            Please enter your preferred new password carefully.
          </span>
        </div>

        {/* to show email */}
        <div className="w-full flex rounded-lg overflow-hidden bg-slate-300 items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-user p-2 bg-slate-500 w-10 text-white"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="flex-grow truncate font-semibold text-slate-800">
            {email}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="new-password-input"
            className="indent-1 flex items-center gap-1"
          >
            <span className="text-base font-semibold text-slate-800">
              New Password
            </span>
            <span className="text-xs text-red-500 font-medium">
              {newPasswordError}
            </span>
          </label>
          <input
            id="new-password-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter a new password"
            className="text-slate-500 border-2 border-slate-300 focus:border-purple-600 transition-all rounded-lg py-2 px-3 outline-none w-full"
            autoComplete="off"
          />
          {error ? (
            <div className="text-sm font-medium text-red-500 indent-2">
              {error}
            </div>
          ) : (
            <></>
          )}
          {success ? (
            <span className="text-sm font-medium text-green-500 indent-2">
              Your new password is set successfully
            </span>
          ) : (
            <></>
          )}
        </div>

        {/* button */}
        <button
          type="submit"
          className="active:shadow-none mt-2 hover:cursor-pointer h-10 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
          disabled={!!newPasswordError || isLoading}
        >
          {isLoading ? (
            <img
              className="w-6"
              src={require("../../Icons/loading-white-bg-purple-600.gif")}
              alt=""
            />
          ) : (
            "Confirm"
          )}
        </button>
      </form>
    </div>
  );
}

export default SetPasswordPage;
