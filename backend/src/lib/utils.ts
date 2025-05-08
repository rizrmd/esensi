import bcrypt from "bcryptjs";

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

interface NavigatorUABrandVersion {
  brand: string;
  version: string;
}

interface NavigatorUAData {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  platform: string;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: NavigatorUAData;
}

function getModernBrowserInfo(): {
  browserName: string;
  version: string;
} | null {
  const nav = navigator as NavigatorWithUAData;

  if (nav.userAgentData) {
    // Get the first non-minor brand (excluding Chromium)
    const brandInfo = nav.userAgentData.brands.find(
      (brand) => brand.brand !== "Chromium" && brand.brand !== "Not-A.Brand"
    );

    if (brandInfo) {
      return {
        browserName: brandInfo.brand,
        version: brandInfo.version,
      };
    }
  }

  return null;
}

function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Firefox") > -1) {
    return "Mozilla Firefox";
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    return "Samsung Browser";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    return "Opera";
  } else if (userAgent.indexOf("Trident") > -1) {
    return "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.indexOf("Edg") > -1) {
    return "Microsoft Edge (Chromium)";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Google Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Apple Safari";
  } else {
    return "Unknown Browser";
  }
}

export function getBrowserInfo() {
  const modernBrowserInfo = getModernBrowserInfo();
  if (modernBrowserInfo) {
    return `${modernBrowserInfo.browserName} ${modernBrowserInfo.version}`;
  } else {
    // Fall back to userAgent parsing
    return getBrowserName();
  }
}

// Helper function to translate error messages to Bahasa Indonesia
export const translateErrorMessage = (errorMessage: string): string => {
  const errorTranslations: Record<string, string> = {
    // Authentication errors
    "Invalid email or password": "Email atau kata sandi tidak valid",
    "Invalid password": "Kata sandi tidak valid",
    "Invalid credentials": "Kredensial tidak valid",
    "Email already exists": "Email sudah terdaftar",
    "Email not found": "Email tidak ditemukan",
    "Email not verified":
      "Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu",
    "Password is required": "Kata sandi wajib diisi",
    "Password must be at least 8 characters":
      "Kata sandi harus minimal 8 karakter",
    "Password is too weak":
      "Kata sandi terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol",
    "Password too short":
      "Kata sandi terlalu pendek. Minimal 8 karakter",
    "Email is required": "Email wajib diisi",
    "Invalid email format": "Format email tidak valid",
    "User not found": "Pengguna tidak ditemukan",
    "User already exists": "Pengguna ini sudah pernah terdaftar",
    "Token expired": "Token sudah kedaluwarsa. Silakan meminta token baru",
    "Invalid token": "Token tidak valid",
    "Account already linked": "Akun sudah terhubung",

    // Two-factor authentication errors
    "Two-factor authentication required": "Verifikasi dua langkah diperlukan",
    "Invalid OTP": "Kode OTP tidak valid",
    "OTP expired": "Kode OTP sudah kedaluwarsa. Silakan meminta kode baru",

    // Session errors
    "Session expired": "Sesi Anda telah berakhir. Silakan masuk kembali",
    "Invalid session": "Sesi tidak valid",

    // Permission errors
    Unauthorized: "Tidak memiliki izin",
    Forbidden: "Akses ditolak",

    // General errors
    "Something went wrong": "Terjadi kesalahan. Silakan coba lagi nanti",
    "Rate limit exceeded": "Terlalu banyak percobaan. Silakan coba lagi nanti",
  };

  // Check for partial matches if exact match is not found
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage];
  }

  // Check for specific parts of error messages
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (errorMessage?.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return original message if no translation found
  return errorMessage;
};
