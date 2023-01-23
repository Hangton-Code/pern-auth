import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useAuth } from "../../AuthProvider";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    login(email, password).then((err) => {
      setIsLoading(false);
      if (err) setError(err);
    });
  };

  return (
    <div className="bg-white w-full h-full flex items-center justify-center p-[6%]">
      <form
        onSubmit={onFormSubmit}
        className="w-full max-w-sm flex flex-col justify-center gap-4"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-3xl leading-relaxed text-slate-800">
            Welcome Back
          </span>
          <span className="text-sm text-slate-500 mb-2">
            Please enter your credentials to continue.
          </span>
        </div>

        {/* input */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email-input"
            className="text-base font-semibold text-slate-800 indent-1 "
          >
            Email
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="text-slate-500 border-2 border-slate-300 focus:border-purple-600 transition-all rounded-lg py-2 px-3 outline-none w-full"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password-input"
            className="text-base font-semibold text-slate-800 indent-1"
          >
            Password
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
              </Link>{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>
          <Link
            to="/auth/credentials/forgot_password"
            className="text-sm font-medium text-purple-600"
          >
            Forgot Password?
          </Link>
        </div>

        {/* button */}
        <button
          type="submit"
          className="hover:cursor-pointer h-10 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
          disabled={!email || !password || !isPolicyAgreed || isLoading}
        >
          {isLoading ? (
            <img
              className="w-6"
              src={require("../../Icons/loading-white-bg-purple-600.gif")}
              alt=""
            />
          ) : (
            "Log In"
          )}
        </button>

        {/* Google */}
        <button
          type="button"
          className="hover:cursor-pointer px-4 py-2 border border-slate-300 text-slate-800 font-medium rounded-lg hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-60"
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/google/login`;
          }}
          disabled={!isPolicyAgreed}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign In With Google
        </button>

        {/* sign up */}
        <span className="leading-normal text-center text-slate-800 font-medium">
          Don't have an account?{" "}
          <Link to="/auth/credentials/signup_email" className="text-purple-600">
            Sign Up
          </Link>
        </span>
      </form>
    </div>
  );
}

export default LoginPage;
