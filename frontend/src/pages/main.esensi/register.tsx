import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Link } from "@/lib/router";

export default () => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Daftar Akun",
    profile: false,
  };

  const local = useLocal(
    {
      loading: true as boolean,
      toggle: {
        password: false as boolean,
        password2: false as boolean,
        terms: false as boolean,
        
      } as any,
    },
    async () => {
      local.loading = false;
      local.render();
    }
  );

  const FormSchema = z.object({
    fullname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email("Alamat email tidak benar"),
    password: z.string().min(8, "Password setidaknya 8 karakter"),
    password2: z.string().min(8, "Password setidaknya 8 karakter"),
    terms_agree: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      password2: "",
      terms_agree: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const handleTogglePass = (e: any) => {
    local.toggle.password = !local.toggle.password;
    local.render();
  };
  const handleTogglePass2 = (e: any) => {
    local.toggle.password2 = !local.toggle.password2;
    local.render();
  };
  const handleCheckTerms = (e: any)=>{
    local.toggle.terms = !local.toggle.terms;
    local.render();
  }

  const renderLoading = <></>;
  const renderRegisterForm = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-7"
      >
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buat akun baru</FormLabel>
              <FormDescription>Buat akun untuk mulai membaca</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama lengkap</FormLabel>
              <FormControl>
                <Input placeholder="John doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat email</FormLabel>
              <FormControl>
                <Input placeholder="email_anda@domain.com" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={local.toggle.password ? "text" : "password"}
                  className="pr-10"
                  placeholder="Buat kata sandi"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 bottom-0 p-0 hover:bg-transparent"
                onClick={handleTogglePass}
              >
                {local.toggle.password ? <Eye /> : <EyeClosed />}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password2"
          render={({ field }) => (
            <FormItem className="relative -mt-3">
              <FormControl>
                <Input
                  type={local.toggle.password2 ? "text" : "password"}
                  className="pr-10"
                  placeholder="Ketik ulang kata sandi"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 bottom-0 p-0 hover:bg-transparent"
                onClick={handleTogglePass2}
              >
                {local.toggle.password2 ? <Eye /> : <EyeClosed />}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms_agree"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl className="w-auto">
                  <Input type="checkbox" className="h-6 w-6 border-[#ccc]" onClick={handleCheckTerms} checked={local.toggle.terms} />
                </FormControl>

                <FormDescription className="text-[#3B2C93] text-xs whitespace-pre-line" onClick={handleCheckTerms}>
                  Saya sudah membaca dan menyetujui<br/>
                  <Link href="#">Syarat & Ketentuan</Link> yang berlaku.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#3B2C93] text-white h-10 rounded-xl border-0"
        >
          Daftar sekarang
        </Button>
        <FormDescription className="text-center -mt-3 font-semibold">
          Sudah punya akun?
          <Link href="/login" className="text-[#3B2C93] ml-2">
            Masuk di sini
          </Link>
        </FormDescription>
      </form>
    </Form>
  );

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex justify-center w-full">
        <div className="flex flex-col justify-start items-center gap-6 w-full py-6 px-6 max-w-[1200px] [&_label]:text-[#3B2C93] [&_label]:font-bold [&_input]:rounded-xl [&_input]:h-10">
          {local.loading ? renderLoading : renderRegisterForm}
        </div>
      </div>
    </MainEsensiLayout>
  );
};
