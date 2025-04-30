import { SideForm } from "@/components/ext/side-form";
import { baseUrl } from "@/lib/gen/base-url";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/auth.esensi";

export default () => {
  const u = baseUrl;
  const params = new URLSearchParams(location.search);
  const username = params.get("username") as string | undefined;
  if (!username) navigate("/");
  const callbackURL = params.get("callbackURL") as string | undefined;
  const local = useLocal(
    {
      authUser: null as any,
    },
    async () => {
      const res = await api.auth_user({ username: username! });
      if (res.error) {
        Alert.info(res.error.message);
      } else {
        local.authUser = res;
        local.render();
      }
      if (!res) navigate("/");
      if (res.email_verified) {
        if (!callbackURL) window.location.replace(u.main_esensi);
        else window.location.replace(callbackURL!);
      }
    }
  );
  const sendVerificationEmail = async () => {
    const res = await betterAuth.sendVerificationEmail({
      email: username!,
      callbackURL,
    });
    if (res.error) {
      Alert.info(res.error.message);
    } else {
      Alert.info("Email verifikasi telah dikirim. Silakan cek email anda.");
    }
  };
  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verifikasi Email</h1>
          <p className="text-muted-foreground mt-2">
            {local.authUser?.is_verified 
              ? "Email anda sudah terverifikasi. Silakan login."
              : "Silakan verifikasi email anda untuk melanjutkan."}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-sm">Email: <strong>{username}</strong></p>
          </div>
          
          <Button 
            onClick={sendVerificationEmail} 
            className="w-full"
          >
            Kirim Email Verifikasi
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <a href={`${u.auth_esensi}/login`} className="underline">Kembali ke halaman login</a>
          </div>
        </div>
      </div>
    </SideForm>
  );
};
