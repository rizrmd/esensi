import { baseUrl } from "@/lib/gen/base-url";
import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth, type User } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocal } from "@/lib/hooks/use-local";

export default () => {
  const u = baseUrl;
  const params = new URLSearchParams(location.search);
  const callbackURL = params.get("callbackURL") as string | undefined;
  const username = params.get("username") as string | undefined;
  const token = params.get("token") as string | undefined;
  const otp = params.get("otp") as string | undefined;

  const [activeTab, setActiveTab] = useState(() => {
    if (token) return "reset-password";
    if (otp) return "verify-otp";
    return "login";
  });

  const [code, setCode] = useState(otp || "");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyType, setVerifyType] = useState<"otp" | "totp">("otp");

  const local = useLocal({
    mode: token ? "reset" : "request",
  });

  useEffect(() => {
    if (!callbackURL && activeTab !== "reset-password") navigate("/");
  }, [callbackURL, activeTab]);

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      toast.error("Masukkan kode 6 digit yang valid.");
      return;
    }
    setIsLoading(true);

    let result;
    if (verifyType === "otp") {
      result = await betterAuth.twoFactor.verifyOtp({
        code,
        trustDevice,
      });
    } else {
      result = await betterAuth.twoFactor.verifyTotp({
        code,
        trustDevice,
      });
    }

    const { data, error } = result;

    if (error) {
      toast.error(`Verifikasi gagal: ${error.message}`);
      setCode("");
    } else if (data?.user) {
      toast.success("Verifikasi berhasil!");
      const redirectUrl = callbackURL || betterAuth.homeUrl(data.user as User);
      window.location.replace(redirectUrl);
    } else {
      toast.error(
        "Verifikasi berhasil tetapi data pengguna tidak ditemukan. Silakan login kembali."
      );
      setActiveTab("login");
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    const { error } = await betterAuth.twoFactor.sendOtp({});
    if (error) {
      toast.error(`Gagal mengirim ulang OTP: ${error.message}`);
    } else {
      toast.success("OTP baru telah dikirim ke email Anda.");
    }
    setIsResending(false);
  };

  useEffect(() => {
    if (
      otp &&
      activeTab === "verify-otp" &&
      code === otp &&
      code.length === 6 &&
      !isLoading
    ) {
      handleOtpSubmit();
    }
  }, [otp, activeTab, code, isLoading]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await betterAuth.social({ provider: "google", callbackURL });
      if (error) {
        toast.error("Google Sign-In failed", { description: error.message });
      }
      // Redirect or further actions are handled by better-auth
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      toast.error("An unexpected error occurred during Google Sign-In.");
    }
  };

  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="flex items-center justify-start mb-6">
          <div className="flex h-9 w-9 items-center justify-center">
            <img src="/img/logo.webp" alt="Esensi Online" className="h-8 w-8" />
          </div>
          <span className="ml-2 font-medium">Esensi Online</span>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex w-full flex-row gap-2 p-1">
            <TabsTrigger value="login" className="flex-1 py-2">Masuk</TabsTrigger>
            <TabsTrigger value="reset-password" className="flex-1 py-2">Reset Password</TabsTrigger>
            <TabsTrigger value="verify-otp" className="flex-1 py-2">Verifikasi OTP</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Masuk</h1>
            </div>
            <EForm
              data={{ username: username || "", password: "", loading: false }}
              onSubmit={async ({ write, read }) => {
                if (!read.loading) {
                  if (!read.username || !read.password) {
                    Alert.info("Isi semua kolom");
                    return;
                  }
                  write.loading = true;

                  const res = await betterAuth.signIn({
                    username: read.username,
                    password: read.password,
                    callbackURL,
                  });

                  if (!res.error) {
                    if (!callbackURL) window.location.replace(u.main_esensi);
                    else window.location.replace(callbackURL);
                    return;
                  }

                  if (res.error) {
                    if (res.error.code === "two-factor-required") {
                      const extendedError = res.error as any;
                      const tfType = extendedError?.metadata?.type as string;
                      setVerifyType(tfType === "totp" ? "totp" : "otp");
                      setActiveTab("verify-otp");
                      Alert.info("Verifikasi dua langkah diperlukan");
                    } else if (res.error.code === "email-not-verified") {
                      Alert.info(res.error.message);
                      navigate(
                        "/email-verification?callbackURL=" +
                          callbackURL +
                          "&username=" +
                          read.username
                      );
                    } else {
                      Alert.info(res.error.message);
                    }
                  }

                  write.loading = false;
                }
              }}
              className="space-y-4"
            >
              {({ Field, read }) => {
                return (
                  <>
                    <Field
                      name="username"
                      disabled={read.loading}
                      label="Email atau username"
                    />
                    <Field
                      name="password"
                      disabled={read.loading}
                      label="Password"
                      input={{ type: "password" }}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-sm h-auto"
                        onClick={() => setActiveTab("reset-password")}
                      >
                        Lupa Password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={read.loading}
                    >
                      {read.loading ? "Sedang Masuk..." : "Masuk"}
                    </Button>
                  </>
                );
              }}
            </EForm>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="18"
                height="18"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Masuk dengan Google
            </Button>
          </TabsContent>

          <TabsContent value="reset-password" className="space-y-4 mt-4">
            {local.mode === "request" ? (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Reset Password</h1>
                  <p className="text-muted-foreground mt-2">
                    Masukkan email Anda untuk menerima instruksi reset password
                  </p>
                </div>
                <EForm
                  data={{ email: "", loading: false }}
                  onSubmit={async ({ write, read }) => {
                    if (!read.loading) {
                      if (!read.email) {
                        Alert.info("Masukkan email Anda");
                        return;
                      }

                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(read.email)) {
                        Alert.info("Format email tidak valid");
                        return;
                      }

                      write.loading = true;

                      try {
                        const res = await betterAuth.forgetPassword({
                          email: read.email,
                          redirectTo:
                            window.location.origin + "/auth.esensi/login",
                        });

                        if (res.error) {
                          Alert.info(res.error.message);
                        } else {
                          Alert.info(
                            "Link reset password telah dikirim ke email Anda"
                          );
                          setActiveTab("login");
                        }
                      } catch (error) {
                        Alert.info("Terjadi kesalahan, silakan coba lagi");
                        console.error(error);
                      }

                      write.loading = false;
                    }
                  }}
                  className="space-y-4"
                >
                  {({ Field, read }) => {
                    return (
                      <>
                        <Field
                          name="email"
                          disabled={read.loading}
                          label="Email"
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={read.loading}
                        >
                          {read.loading ? "Mengirim..." : "Kirim Link Reset"}
                        </Button>

                        <div className="text-center text-sm">
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 text-sm h-auto"
                            onClick={() => setActiveTab("login")}
                          >
                            Kembali ke halaman login
                          </Button>
                        </div>
                      </>
                    );
                  }}
                </EForm>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Reset Password</h1>
                  <p className="text-muted-foreground mt-2">
                    Masukkan password baru Anda
                  </p>
                </div>
                <EForm
                  data={{ password: "", confirmPassword: "", loading: false }}
                  onSubmit={async ({ write, read }) => {
                    if (!read.loading) {
                      if (!read.password || !read.confirmPassword) {
                        Alert.info("Isi semua kolom");
                        return;
                      }

                      if (read.password !== read.confirmPassword) {
                        Alert.info(
                          "Password dan konfirmasi password tidak sama"
                        );
                        return;
                      }

                      if (read.password.length < 8) {
                        Alert.info("Password minimal 8 karakter");
                        return;
                      }

                      write.loading = true;

                      try {
                        const res = await betterAuth.resetPassword({
                          newPassword: read.password,
                          token: token!,
                        });

                        if (res.error) {
                          Alert.info(res.error.message);
                        } else {
                          Alert.info("Password berhasil diubah");
                          setTimeout(() => {
                            setActiveTab("login");
                          }, 2000);
                        }
                      } catch (error) {
                        Alert.info("Terjadi kesalahan, silakan coba lagi");
                        console.error(error);
                      }

                      write.loading = false;
                    }
                  }}
                  className="space-y-4"
                >
                  {({ Field, read }) => {
                    return (
                      <>
                        <Field
                          name="password"
                          disabled={read.loading}
                          label="Password Baru"
                          input={{ type: "password" }}
                        />
                        <Field
                          name="confirmPassword"
                          disabled={read.loading}
                          label="Konfirmasi Password"
                          input={{ type: "password" }}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={read.loading}
                        >
                          {read.loading
                            ? "Menyimpan..."
                            : "Simpan Password Baru"}
                        </Button>
                      </>
                    );
                  }}
                </EForm>
              </>
            )}
          </TabsContent>

          <TabsContent value="verify-otp" className="space-y-4 mt-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">
                {verifyType === "otp"
                  ? "Verifikasi OTP"
                  : "Verifikasi Autentikator"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {verifyType === "otp"
                  ? "Masukkan kode 6 digit yang dikirim ke email Anda"
                  : "Masukkan kode 6 digit dari aplikasi autentikator Anda"}
              </p>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-code">Kode Verifikasi</Label>
                <Input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trust-device"
                  checked={trustDevice}
                  onCheckedChange={(checked) =>
                    setTrustDevice(Boolean(checked))
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="trust-device"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Percaya perangkat ini selama 30 hari
                </Label>
              </div>

              {verifyType === "otp" && (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={handleResendOtp}
                  disabled={isResending || isLoading}
                >
                  {isResending ? "Mengirim..." : "Kirim Ulang Kode"}
                </Button>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
              </Button>

              <div className="text-center text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-sm h-auto"
                  onClick={() => setActiveTab("login")}
                >
                  Kembali ke halaman login
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </SideForm>
  );
};
