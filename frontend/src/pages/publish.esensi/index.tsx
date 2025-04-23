import { Link } from "@/lib/router";

export default () => {
  return (
    <>
      <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
        Publish Esensi Online
      </h1>
      <p className="text-center">
        Belum punya akun? Silakan{" "}
        <a
          href="http://localhost:7500/register?callbackURL=http://localhost:8100/onboarding"
          className="underline"
        >
          register
        </a>
      </p>
    </>
  );
};
