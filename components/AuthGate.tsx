"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "signed_out" | "signed_in">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "signed_in" : "signed_out");
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "signed_in" : "signed_out");
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSendLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsSending(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the sign-in link.");
    }
    setIsSending(false);
  };

  if (status === "loading") {
    return <div className="text-sm text-stone">Checking session...</div>;
  }

  if (status === "signed_in") {
    return <>{children}</>;
  }

  return (
    <div className="card-surface p-8 max-w-md">
      <p className="text-xs uppercase tracking-[0.2em] text-stone">Sign In</p>
      <h2 className="text-2xl font-semibold mt-2" style={{ fontFamily: "var(--font-display)" }}>
        Access the Dashboard
      </h2>
      <p className="subtle-text mt-2">Use your email to receive a secure sign-in link.</p>
      <form onSubmit={handleSendLink} className="mt-4 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isSending}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send Sign-In Link"}
        </button>
        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </form>
    </div>
  );
}
