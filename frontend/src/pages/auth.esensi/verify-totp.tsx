import React, { useState } from "react";
import { betterAuth, type User } from "@/lib/better-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";

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
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Authenticator Code</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-code">Verification Code</Label>
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
                Trust this device for 30 days
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </CardFooter>
        </form>
        {/* TODO: Add link/button for "Use a backup code" */}
        {/* TODO: Add link/button for "Use email OTP" if applicable */}
      </Card>
    </div>
  );
}
