import React, { useState, useEffect } from "react";
import { betterAuth, type Session } from "@/lib/better-auth"; // Use type-only import for Session
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
import { toast } from "sonner";
// import QRCode from 'react-qr-code'; // Placeholder for QR code generation
// Removed Jotai import

export default function TwoFactorSetupPage() {
  const [password, setPassword] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]); // Renamed state
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null); // Use imported Session type
  const [sessionLoading, setSessionLoading] = useState(true); // Add state for loading

  useEffect(() => {
    const fetchSession = async () => {
      setSessionLoading(true);
      const { session: fetchedSession, error } = await betterAuth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        // Handle error appropriately, maybe redirect to login
        setSession(null);
      } else {
        setSession(fetchedSession);
        // Update 2FA status based on fetched session
        if (fetchedSession?.user?.twoFactorEnabled) {
          setIs2faEnabled(true);
        } else {
          setIs2faEnabled(false);
          setQrCodeUri(null);
          setBackupCodes([]);
        }
      }
      setSessionLoading(false);
    };

    fetchSession();
  }, []); // Fetch session on component mount

  // This useEffect now only reacts to changes in the fetched session state
  useEffect(() => {
    if (session && session.user && session.user.twoFactorEnabled) {
      setIs2faEnabled(true);
    } else {
      setIs2faEnabled(false);
      setQrCodeUri(null);
      setBackupCodes([]);
    }
  }, [session]); // Depend only on session

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQrCodeUri(null);
    setBackupCodes([]); // Use renamed state setter

    const { data, error } = await betterAuth.twoFactor.enable({ password });

    if (error) {
      toast.error(`Failed to enable 2FA: ${error.message}`);
      console.error("Enable 2FA error:", error);
    } else if (data) {
      toast.success(
        "2FA enabled successfully! Scan the QR code and save your backup codes."
      );
      setIs2faEnabled(true);
      setQrCodeUri(data.totpURI); // Correct property name
      setBackupCodes(data.backupCodes); // Correct property name and state setter
      setPassword(""); // Clear password field
      // TODO: Display QR Code using the 'totpURI' (e.g., with react-qr-code)
      // TODO: Prompt user to verify TOTP before finalizing setup (Good practice)
    }
    setIsLoading(false);
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    const { error } = await betterAuth.twoFactor.disable({ password });

    if (error) {
      toast.error(`Failed to disable 2FA: ${error.message}`);
      console.error("Disable 2FA error:", error);
    } else {
      toast.success("2FA disabled successfully.");
      setIs2faEnabled(false);
      setQrCodeUri(null);
      setBackupCodes([]); // Use renamed state setter
      setPassword(""); // Clear password field
    }
    setIsLoading(false);
  };

  if (sessionLoading) {
    return <div>Loading session...</div>; // Or a proper loading component
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>
            {is2faEnabled
              ? "Manage your two-factor authentication settings."
              : "Add an extra layer of security to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {is2faEnabled ? (
            <div>
              <p className="text-green-600 font-semibold mb-4">
                2FA is currently enabled.
              </p>
              <div className="space-y-2">
                <Label htmlFor="password-disable">
                  Enter Password to Disable
                </Label>
                <Input
                  id="password-disable"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your current password"
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Display existing backup codes if 2FA is enabled */}
              {/* Note: Better Auth might not provide existing codes after initial setup for security */}
              {/* {backupCodes.length > 0 && (
                 <div>
                   <h3 className="font-semibold mt-4 mb-2">Backup Codes</h3>
                   <p className="text-sm text-muted-foreground mb-2">These codes were provided during setup. Keep them safe.</p>
                   <ul className="list-disc list-inside bg-gray-100 p-3 rounded">
                     {backupCodes.map((code, index) => (
                       <li key={index} className="font-mono">{code}</li>
                     ))}
                   </ul>
                 </div>
              )} */}
            </div>
          ) : (
            <form onSubmit={handleEnable2FA} className="space-y-4">
              <p className="text-orange-600 font-semibold mb-4">
                2FA is currently disabled.
              </p>
              <div className="space-y-2">
                <Label htmlFor="password-enable">
                  Enter Password to Enable
                </Label>
                <Input
                  id="password-enable"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your current password"
                  required
                  disabled={isLoading}
                />
              </div>
              {qrCodeUri && (
                <div className="mt-4 text-center">
                  <h3 className="font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Scan this QR code with your authenticator app (e.g., Google
                    Authenticator, Authy).
                  </p>
                  {/* Placeholder for QR Code Component */}
                  <div className="p-4 bg-white inline-block">
                    {/* <QRCode value={qrCodeUri} size={128} /> */}
                    <p className="text-xs break-all mt-2">URI: {qrCodeUri}</p>
                    <p className="text-red-500 text-sm mt-2">
                      (QR Code component needs to be installed and implemented)
                    </p>
                  </div>

                  <h3 className="font-semibold mt-4 mb-2">Backup Codes</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Save these codes securely. They can be used to access your
                    account if you lose your 2FA device.
                  </p>
                  <ul className="list-disc list-inside bg-gray-100 p-3 rounded text-left">
                    {backupCodes.map(
                      (
                        code,
                        index // Use renamed state
                      ) => (
                        <li key={index} className="font-mono">
                          {code}
                        </li>
                      )
                    )}
                  </ul>
                  {/* TODO: Add verification step */}
                  {/* <p className="mt-4">After scanning, enter the code from your app below to verify:</p> */}
                  {/* Input and Verify Button */}
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading || !password || !!qrCodeUri}
              >
                {isLoading ? "Processing..." : "Enable 2FA"}
              </Button>
            </form>
          )}
        </CardContent>
        {is2faEnabled && (
          <CardFooter>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={isLoading || !password}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
