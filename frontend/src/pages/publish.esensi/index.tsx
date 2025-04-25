import { Protected } from "@/components/app/protected";
import { baseUrl } from "@/lib/gen/base-url";
import { navigate } from "@/lib/router";

export default () => {
  const content = (
    <>
      <p className="text-center">
        Belum punya akun? Silakan{" "}
        <a
          href={`${baseUrl.auth_esensi}/register?callbackURL=${baseUrl.publish_esensi}/onboarding`}
          className="underline"
        >
          register
        </a>
      </p>
      <p className="text-center">
        Sudah punya akun? Silakan{" "}
        <a
          href="${base_url.auth_esensi}/login?callbackURL=${base_url.publishƒ_esensi}/dashboard"
          className="underline"
        >
          login
        </a>
      </p>
    </>
  );
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
          } else {
          }
        }}
        fallback={() => content}
      >
        {content}
      </Protected>
    </>
  );
};
