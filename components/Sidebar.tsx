"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/certifications", label: "Certifications" },
  { href: "/resume", label: "Resume" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/training-amendments", label: "Training Amendments" },
  { href: "/documents", label: "Documents" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  return (
    <aside className="bg-paper border-r border-black/5 px-6 py-8 sticky top-0 h-screen">
      <div className="space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone">IT Career</p>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Transition Dashboard
          </h1>
          <p className="subtle-text mt-2">Primary user: Christopher Maricle</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block rounded-xl px-4 py-2 text-sm font-medium transition",
                  isActive ? "bg-ink text-mist" : "text-ink hover:bg-ink/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="card-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Stakeholders</p>
          <p className="mt-3 text-sm">Employment Counselor</p>
          <p className="text-sm">Training Provider</p>
        </div>
        <div className="card-surface p-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Session</p>
          <p className="text-sm">{session?.user.email ?? "Not signed in"}</p>
          {session ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
