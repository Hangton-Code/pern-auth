import Design from "./Design";
import { Link, Outlet } from "react-router-dom";

function CredentialsPage() {
  return (
    <div className="w-screen h-screen grid grid-cols-2 max-md:grid-cols-1">
      <div className="grid grid-rows-[min-content_1fr_min-content]">
        <Link
          to="/"
          className="text-lg font-bold text-purple-600 py-2 px-4 max-md:text-center"
        >
          PERN AUTH
        </Link>
        <Outlet />
        <span className="font-medium text-slate-800 bg-white py-2 px-4 max-md:text-center">
          © Code Hangton
        </span>
      </div>

      <Design />
    </div>
  );
}

export default CredentialsPage;
