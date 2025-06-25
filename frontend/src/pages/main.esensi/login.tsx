import { MainEsensiLayout } from "@/components/esensi/layout";
import { LoginBanner } from "@/components/esensi/login-banner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { Link, navigate } from "@/lib/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default () => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Masuk Akun",
    profile: false,
    desktopHide: true,
  };
  const footer_config = {
    desktopHide: true,
  };

  const local = useLocal(
    {
      loading: false as boolean,
      toggle: {
        password: false as boolean,
      } as any,
    },
    async () => {
      local.loading = false;
      local.render();
    }
  );

  const logo = `<svg viewBox="0 0 55 63" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.4035 11.7311C26.1143 12.4694 30.5888 10.1295 32.7601 6.22607L5.95181 13.5606C-1.59539 37.6816 -0.660926 51.4766 8.53534 58.6266C11.8719 61.2054 15.5219 62.4106 19.4851 62.5355C26.8619 62.7635 35.2172 59.1641 43.9077 53.6102C22.1071 62.4269 24.2124 38.0019 24.2124 38.0019C24.5807 33.3058 26.4167 26.0201 29.33 17.2849C27.7579 14.4238 24.9105 12.2848 21.4035 11.7365V11.7311Z" /><path d="M48.1519 16.0692C67.3359 -7.99208 34.0139 2.1004 34.0139 2.1004L33.838 3.4305C33.893 3.19162 33.9534 2.95817 33.9919 2.7193C33.041 8.64232 37.1251 14.207 43.1222 15.1462C38.2025 14.3753 33.5302 16.9595 31.4853 21.1833L28.9678 40.1358L48.1519 16.0746V16.0692Z" /></svg>`;

  const googleIcon = `<svg width="16" height="16" viewBox="0 0 255.87800000000001 261.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>`;
  const googleLogin = (e:any) => {
    e.preventDefault();
  };

  const FormSchema = z.object({
    email: z.string().email("Alamat email tidak benar"),
    password: z.string().min(8, "Password setidaknya 8 karakter"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    local.loading = true;
    local.render();

    try {
      const { data: authData, error } = await betterAuth.signIn({
        username: data.email,
        password: data.password,
        rememberMe: true,
      });

      if (error) {
        toast.error("Gagal masuk", {
          description: error.message || "Email atau kata sandi salah",
        });
      } else if (authData) {
        toast.success("Berhasil masuk ke akun");
        // Redirect to dashboard or home
        navigate("/");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi",
      });
    } finally {
      local.loading = false;
      local.render();
    }
  }

  const handleTogglePass = (e: any) => {
    local.toggle.password = !local.toggle.password;
    local.render();
  };

  const renderLoading = <></>;
  const renderLoginForm = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full lg:max-w-88 gap-7"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  type={local.toggle.password ? "text" : "password"}
                  className="pr-10"
                  placeholder="Kata sandi"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0.5 p-0 hover:bg-transparent"
                onClick={handleTogglePass}
              >
                {local.toggle.password ? <Eye /> : <EyeClosed />}
              </Button>
              <FormDescription>
                <Link
                  href="/forgot"
                  className="text-xs text-[#3B2C93] font-bold"
                >
                  Lupa kata sandi?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#3B2C93] text-white h-10 rounded-xl border-0"
          disabled={local.loading}
        >
          {local.loading ? "Memproses..." : "Masuk ke akun"}
        </Button>
        <Button
          type="button"
          className="flex justify-center items-center -mt-4 gap-1.5 bg-white text-black hover:bg-[#eee] border border-black h-10 rounded-xl"
          disabled={local.loading}
          onClick={googleLogin}
        >
          <span dangerouslySetInnerHTML={{ __html: googleIcon }}></span>
          <span>Masuk menggunakan akun Google</span>
        </Button>
        <FormDescription className="text-center -mt-3 font-semibold">
          Belum punya akun?
          <Link href="/register" className="text-[#3B2C93] ml-2">
            Daftar sekarang
          </Link>
        </FormDescription>
      </form>
    </Form>
  );

  const renderLoginHeader = (
    <div className="flex w-full lg:max-w-88 flex-col items-center gap-6 text-[#3B2C93]">
      <div
        className="w-1/4 [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: logo }}
      ></div>
      <h2 className="whitespace-pre-line text-3xl text-center font-semibold">
        Selamat Datang di Esensi online
      </h2>
    </div>
  );

  const renderLoginBanner = <LoginBanner></LoginBanner>;

  return (
    <MainEsensiLayout
      header_config={header_config}
      footer_config={footer_config}
      mobile_menu={true}
    >
      <div className="flex justify-center w-full lg:min-h-screen">
        <div className="hidden lg:flex flex-col flex-1">
          {local.loading ? renderLoading : renderLoginBanner}
        </div>
        <div className="flex flex-col flex-1 justify-start items-center lg:justify-center gap-6 w-full p-6 lg:p-8 max-w-[1200px] [&_label]:text-[#3B2C93] [&_label]:font-bold [&_input]:rounded-xl [&_input]:h-10">
          {local.loading ? renderLoading : renderLoginHeader}
          {local.loading ? renderLoading : renderLoginForm}
        </div>
      </div>
    </MainEsensiLayout>
  );
};
