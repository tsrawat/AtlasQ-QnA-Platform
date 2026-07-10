"use client";

import { BrandMark } from "@/components/brand";
import { Surface } from "@/components/design-system";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  if (session) return null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <BrandMark />
      </div>
      <section className="mx-auto w-full max-w-md">
        <Surface className="p-6 sm:p-8">{children}</Surface>
      </section>
    </main>
  );
};

export default Layout;
