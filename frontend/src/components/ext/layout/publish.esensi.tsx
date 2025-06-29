import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import type { User } from "backend/lib/better-auth";
import { Role } from "backend/lib/types";
import type { FC, ReactNode } from "react";
import { MenuBarPublish } from "../menu-bar/publish";
import { PublishFallback } from "../publish-fallback";

export const current = {
  user: undefined as User | undefined,
};

export const Layout: FC<{
  loading?: boolean;
  children?: ReactNode;
}> = ({ loading, children }) => {
  const roles = [Role.AUTHOR, Role.PUBLISHER];

  useLocal({}, async () => {
    const res = await betterAuth.getSession();
    current.user = res.data?.user;
    if (!current.user) return;
  });

  if (loading) {
    return (
      <Protected role={roles} fallback={PublishFallback}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarPublish />
          <div className="flex-1 flex items-center justify-center">
            <AppLoading />
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected role={roles} fallback={PublishFallback}>
      {current.user && (
        <div className="flex min-h-screen flex-col bg-gray-50">{children}</div>
      )}
    </Protected>
  );
};
