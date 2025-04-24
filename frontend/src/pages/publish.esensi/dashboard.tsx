import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import React, { useState } from "react";

export default () => {
  let [isAuthenticated, setIsAuthenticated] = useState(true);
  if (!isAuthenticated) navigate("/");
  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <Protected role={["publisher", "author"]}>
      {({ user }) => (
        <>
          <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
            Dashboard Publish Esensi Online {user?.name}
          </h1>
          <p className="text-center">
            This is a protected page. You must be authenticated first if you
            want to open this page{" "}
          </p>
          <div className="text-center mt-6">
            <Button onClick={logout}>Logout</Button>
          </div>
        </>
      )}
    </Protected>
  );
};
