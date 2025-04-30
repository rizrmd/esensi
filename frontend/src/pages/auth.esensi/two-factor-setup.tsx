import React, { useState, useEffect } from "react";
import { betterAuth, type Session } from "@/lib/better-auth"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SideForm } from "@/components/ext/side-form";
// Optional: import QRCode if you decide to implement it
// import QRCode from 'react-qr-code';

export default function TwoFactorSetupPage() {
  const [password, setPassword] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setSessionLoading(true);
      const { session: fetchedSession, error } = await betterAuth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } else {
        setSession(fetchedSession);
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
  }, []);

  useEffect(() => {
    if (session && session.user && session.user.twoFactorEnabled) {
      setIs2faEnabled(true);
    } else {
      setIs2faEnabled(false);
      setQrCodeUri(null);
      setBackupCodes([]);
    }
  }, [session]);

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQrCodeUri(null);
    setBackupCodes([]);

    const { data, error } = await betterAuth.twoFactor.enable({ password });

    if (error) {
      toast.error(`Failed to enable 2FA: ${error.message}`);
      console.error("Enable 2FA error:", error);
    } else if (data) {
      toast.success(
        "2FA enabled successfully! Scan the QR code and save your backup codes."
      );
      setIs2faEnabled(true);
      setQrCodeUri(data.totpURI);
      setBackupCodes(data.backupCodes);
      setPassword("");
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
      setBackupCodes([]);
      setPassword("");
    }
    setIsLoading(false);
  };

  if (sessionLoading) {
    return (
      <SideForm sideImage={"/img/side-bg.jpg"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="mb-2">Loading session...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </SideForm>
    );
  }

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
          <h1 className="text-2xl font-semibold">Autentikasi Dua Faktor</h1>
          <p className="text-muted-foreground mt-2">
            {is2faEnabled
              ? "Kelola pengaturan autentikasi dua faktor Anda"
              : "Tambahkan lapisan keamanan ekstra untuk akun Anda"}
          </p>
        </div>
        
        <div className="space-y-4">
          {is2faEnabled ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium text-sm">
                  Autentikasi dua faktor saat ini aktif.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-disable">
                  Masukkan Password untuk Menonaktifkan
                </Label>
                <Input
                  id="password-disable"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password Anda saat ini"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button
                variant="destructive"
                onClick={handleDisable2FA}
                disabled={isLoading || !password}
                className="w-full"
              >
                {isLoading ? "Menonaktifkan..." : "Nonaktifkan 2FA"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEnable2FA} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-700 font-medium text-sm">
                  Autentikasi dua faktor saat ini tidak aktif.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-enable">
                  Masukkan Password untuk Mengaktifkan
                </Label>
                <Input
                  id="password-enable"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password Anda saat ini"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {qrCodeUri && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-center mb-2">Pindai Kode QR</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Pindai kode QR ini dengan aplikasi autentikator Anda (mis., Google Authenticator atau Authy)
                    </p>
                    
                    {/* QR Code placeholder - replace with actual component when available */}
                    <div className="h-40 w-40 mx-auto bg-gray-100 flex items-center justify-center border">
                      {/* <QRCode value={qrCodeUri} size={160} /> */}
                      <p className="text-xs text-center px-2">QR Code Component Needed</p>
                    </div>
                    
                    <p className="text-xs break-all mt-2 text-center text-muted-foreground">
                      URI: {qrCodeUri}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-center mb-2">Kode Cadangan</h3>
                    <p className="text-sm text-muted-foreground mb-2 text-center">
                      Simpan kode ini di tempat yang aman. Kode ini dapat digunakan jika Anda kehilangan perangkat 2FA.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="font-mono text-sm p-1 bg-white border rounded">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !password || !!qrCodeUri}
              >
                {isLoading ? "Memproses..." : "Aktifkan 2FA"}
              </Button>
            </form>
          )}
          
          <div className="text-center text-sm">
            <a href="/auth.esensi/login" className="text-muted-foreground hover:underline">
              Kembali ke halaman login
            </a>
          </div>
        </div>
      </div>
    </SideForm>
  );
}
