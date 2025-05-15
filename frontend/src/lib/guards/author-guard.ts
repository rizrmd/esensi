import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { api } from "@/lib/gen/publish.esensi";

export const authorGuard = async () => {
  const session = await betterAuth.getSession();
  
  if (!session) {
    navigate("/login?callbackURL=" + encodeURIComponent(window.location.href));
    return false;
  }
  
  try {
    const result = await api.check_author({ user: session.data!.user });
    
    if (!result.success || !result.data?.isAuthor) {
      navigate("/dashboard");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking author status:", error);
    navigate("/dashboard");
    return false;
  }
};
