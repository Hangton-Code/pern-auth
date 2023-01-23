import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

function SignupEmailPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signupEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    signupEmail(email).then((err) => {
      setIsLoading(false);
      if (err) setError(err);
      else {
        setError("");
        setSuccess(true);
      }
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
            Hi, There
          </span>
          <span className="text-sm text-slate-500">
            Please enter your credentials to sign up
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

          {error ? (
            <span className="text-sm font-medium text-red-500 indent-2">
              {error}
            </span>
          ) : (
            <></>
          )}
          {success ? (
            <span className="text-sm font-medium text-green-500 indent-2">
              Check your email inbox to continue the registration.
            </span>
          ) : (
            <></>
          )}
        </div>

        {/* button */}
        <button
          type="submit"
          className="hover:cursor-pointer mt-1 h-10 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:shadow-purple-300 hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 flex justify-center"
          disabled={!email || isLoading}
        >
          {isLoading ? (
            <img
              className="w-6"
              src={require("../../Icons/loading-white-bg-purple-600.gif")}
              alt=""
            />
          ) : (
            "Start For Free"
          )}
        </button>

        {/* Login */}
        <span className="leading-normal text-center text-slate-800 font-medium">
          Already have an account?{" "}
          <Link to="/auth/credentials/login" className="text-purple-600">
            Log In
          </Link>
        </span>
      </form>
    </div>
  );
}

export default SignupEmailPage;
