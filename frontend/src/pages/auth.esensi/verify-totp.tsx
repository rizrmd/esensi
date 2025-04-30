import React, { useState } from "react";
import { betterAuth, type User } from "@/lib/better-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SideForm } from "@/components/ext/side-form";

export default function VerifyTotpPage() {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/verify-totp" }); // Adjust route if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await betterAuth.twoFactor.verifyTotp({
      code,
      trustDevice,
    });

    if (error) {
      toast.error(`Verification failed: ${error.message}`);
      console.error("Verify TOTP error:", error);
      setCode(""); // Clear code input on error
    } else if (data?.user) {
      toast.success("Verification successful!");
      // Determine redirect URL: use callbackURL from search params or default home
      const redirectUrl =
        search?.callbackURL || betterAuth.homeUrl(data.user as User);
      navigate({ to: redirectUrl, replace: true });
    } else {
      // Handle unexpected success state without user data if necessary
      toast.error(
        "Verification succeeded but user data is missing. Please try logging in again."
      );
      navigate({ to: "/auth/login", replace: true }); // Redirect to login
    }

    setIsLoading(false);
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
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verifikasi Autentikator</h1>
          <p className="text-muted-foreground mt-2">
            Masukkan kode 6 digit dari aplikasi autentikator Anda
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totp-code">Kode Verifikasi</Label>
            <Input
              id="totp-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // Allow only digits
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
              onCheckedChange={(checked) => setTrustDevice(Boolean(checked))}
              disabled={isLoading}
            />
            <Label
              htmlFor="trust-device"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Percaya perangkat ini selama 30 hari
            </Label>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
          </Button>
          
          <div className="text-center text-sm">
            <a href="/auth.esensi/login" className="text-muted-foreground hover:underline">
              Kembali ke halaman login
            </a>
          </div>
        </form>
      </div>
    </SideForm>
  );
}
