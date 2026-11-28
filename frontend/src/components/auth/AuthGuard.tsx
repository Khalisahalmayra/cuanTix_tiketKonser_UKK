
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const res = await fetch(
          "http://localhost:4000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.replace("/auth/login");
          return;
        }

        const data = await res.json();

        if (!active) return;

        if (data.user.role !== "customer") {
          router.replace("/auth/login");
          return;
        }

        setAllowed(true);
      } catch {
        router.replace("/auth/login");
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
