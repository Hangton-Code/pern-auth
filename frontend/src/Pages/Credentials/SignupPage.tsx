import { FormEvent, useState, useMemo, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuth } from "../../AuthProvider";

function SignupPage() {
  // query data
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");
  const email = useMemo(() => {
    if (!token) return "false";
    try {
      return (jwt_decode(token as string) as any).email as string;
    } catch {
      return "false";
    }
  }, [token]);

  const [userName, setUserName] = useState("");
  const userNameError = useMemo(() => {
    if (userName.length < 6 || userName.length > 30) {
      return "*must contain 6 to 30 characters";
    }
    return "";
  }, [userName]);
  const [password, setPassword] = useState("");
  const passwordError = useMemo(() => {
    if (password.length < 8 || password.length > 30) {
      return "*must contain 8 to 30 characters";
    }
    return "";
  }, [password]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const { signup } = useAuth();

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    signup(userName, password, token as string).then((err) => {
      setIsLoading(false);
      if (err) setError(err);
    });
  };

  if (!token || email === "false") return <Navigate to="/" />;

  return (
    <div className="bg-white w-full h-full flex items-center justify-center p-[6%]">
      <form
        onSubmit={onFormSubmit}
        className="w-full max-w-sm flex flex-col justify-center gap-4"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-3xl leading-relaxed text-slate-800">
            Registration
          </span>
          <span className="text-sm text-slate-500 mb-2">
            Please enter the information down below carefully.
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

        {/* username */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="user-name-input"
            className="indent-1 flex items-center gap-1"
          >
            <span className="text-base font-semibold text-slate-800">
              User Name
            </span>
            <span className="text-xs text-red-500 font-medium">
              {userNameError}
            </span>
          </label>
          <input
            id="user-name-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter a user name"
            className="text-slate-500 border-2 border-slate-300 focus:border-purple-600 transition-all rounded-lg py-2 px-3 outline-none w-full"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password-input"
            className="indent-1 flex items-center gap-1"
          >
            <span className="text-base font-semibold text-slate-800">
              Password
            </span>
            <span className="text-xs text-red-500 font-medium">
              {passwordError}
            </span>
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
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
        </div>

        {/* next */}
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-2">
            <input
              id="agree-checkbox"
              type="checkbox"
              value={String(isPolicyAgreed)}
              onChange={() => setIsPolicyAgreed((prev) => !prev)}
              className="scale-125"
            />
            <label
              htmlFor="agree-checkbox"
              className="text-sm font-medium text-slate-800"
            >
              Agree to our{" "}
              <Link to="/policy" className="text-blue-600">
                policy
              </Link>
            </label>
          </div>
        </div>

        {/* button */}
        <button
          type="submit"
          className="hover:cursor-pointer h-10 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
          disabled={
            !!userNameError ||
            !!passwordError ||
            !!error ||
            !isPolicyAgreed ||
            isLoading
          }
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
export default SignupPage;
