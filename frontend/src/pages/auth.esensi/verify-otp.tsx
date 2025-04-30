import React, { useState, useEffect } from "react";
import { betterAuth, type User } from "@/lib/better-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SideForm } from "@/components/ext/side-form";

export default function VerifyOtpPage() {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/verify-otp" }); // Adjust route if needed

  // Automatically try to extract OTP from URL query param on load
  useEffect(() => {
    if (
      search?.otp &&
      typeof search.otp === "string" &&
      /^\d{6}$/.test(search.otp)
    ) {
      setCode(search.otp);
      toast.info("OTP code pre-filled from URL.");
      // Optional: Automatically submit if OTP is in URL?
      // handleSubmit(); // Consider security implications
    }
  }, [search]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }
    setIsLoading(true);

    const { data, error } = await betterAuth.twoFactor.verifyOtp({
      code,
      trustDevice,
    });

    if (error) {
      toast.error(`Verification failed: ${error.message}`);
      console.error("Verify OTP error:", error);
      setCode(""); // Clear code input on error
    } else if (data?.user) {
      toast.success("Verification successful!");
      // Determine redirect URL: use callbackURL from search params or default home
      const redirectUrl =
        search?.callbackURL || betterAuth.homeUrl(data.user as User);
      navigate({ to: redirectUrl, replace: true });
    } else {
      // Handle unexpected success state without user data
      toast.error(
        "Verification succeeded but user data is missing. Please try logging in again."
      );
      navigate({ to: "/auth/login", replace: true }); // Redirect to login
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    const { error } = await betterAuth.twoFactor.sendOtp({}); // Pass empty object if no specific query needed
    if (error) {
      toast.error(`Failed to resend OTP: ${error.message}`);
      console.error("Resend OTP error:", error);
    } else {
      toast.success("A new OTP has been sent to your email.");
    }
    setIsResending(false);
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
          <h1 className="text-2xl font-semibold">Verifikasi OTP</h1>
          <p className="text-muted-foreground mt-2">
            Masukkan kode 6 digit yang dikirim ke email Anda
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="button"
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={handleResendOtp}
            disabled={isResending || isLoading}
          >
            {isResending ? "Mengirim..." : "Kirim Ulang Kode"}
          </Button>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
          </Button>
        </form>
      </div>
    </SideForm>
  );
}
