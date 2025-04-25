import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";

export default async () => {
  const logout = () => {
    betterAuth.signOut();
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
