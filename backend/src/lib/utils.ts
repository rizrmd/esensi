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
