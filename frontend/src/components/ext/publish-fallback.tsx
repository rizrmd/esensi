import { navigate } from "@/lib/router";
import { Role } from "backend/api/types";
import { AppLoading } from "../app/loading";

export const PublishFallback = (opt: { missing_role: Role[] }) => {
  if (opt.missing_role.some((x) => x === Role.AUTHOR || x === Role.PUBLISHER)) {
    navigate("/onboarding");
    return <AppLoading />;
  }
  return null;
};
