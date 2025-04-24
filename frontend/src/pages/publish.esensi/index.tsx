import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Link, navigate } from "@/lib/router";

export default () => {
  return (
    <>
      <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
        Publish Esensi Online
      </h1>

      <Protected
        role={["publisher", "author"]}
        onLoad={({ user }) => {
          if (user) {
            if (user.id_publisher || user.id_author) {
              navigate("/dashboard");
            }
          }
        }}
        fallback={() => (
          <>
            <p className="text-center">
              Belum punya akun? Silakan{" "}
              <a
                href="http://localhost:7500/register?callbackURL=http://localhost:8100/onboarding"
                className="underline"
              >
                register
              </a>
            </p>
            <p className="text-center">
              Sudah punya akun? Silakan{" "}
              <a
                href="http://localhost:7500/login?callbackURL=http://localhost:8100/dashboard"
                className="underline"
              >
                login
              </a>
            </p>
          </>
        )}
      >
        <AppLoading />
      </Protected>
    </>
  );
};
