import Design from "./Design";
import { Outlet } from "react-router-dom";

function CredentialsPage() {
  return (
    <div className="w-screen h-screen grid grid-cols-2 max-md:grid-cols-1">
      <Outlet />
      <Design />
    </div>
  );
}

export default CredentialsPage;
