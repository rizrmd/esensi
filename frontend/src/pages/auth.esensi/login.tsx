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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
            <TabsTrigger value="verify-otp">Verifikasi OTP</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Login</h1>
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
                      label="Email or username"
                    />
                    <Field
                      name="password"
                      disabled={read.loading}
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
                      {read.loading ? "Logging in..." : "Login"}
                    </Button>
                  </>
                );
              }}
            </EForm>
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
