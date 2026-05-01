import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useUpsertVisitor } from "@workspace/api-client-react";

interface UsernameContextValue {
  username: string | null;
  saveUsername: (newUsername: string, spaceId?: number) => Promise<boolean>;
  isPending: boolean;
  clearUsername: () => void;
}

const UsernameContext = createContext<UsernameContextValue | null>(null);

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("xcoms_username");
  });
  const upsertMutation = useUpsertVisitor();

  useEffect(() => {
    const saved = localStorage.getItem("xcoms_username");
    if (saved && saved !== username) setUsername(saved);
  }, []);

  const saveUsername = useCallback(async (newUsername: string, spaceId?: number) => {
    const clean = newUsername.replace(/^@/, "");
    try {
      await upsertMutation.mutateAsync({ data: { username: clean, spaceId } });
      localStorage.setItem("xcoms_username", clean);
      setUsername(clean);
      return true;
    } catch {
      return false;
    }
  }, [upsertMutation]);

  const clearUsername = useCallback(() => {
    localStorage.removeItem("xcoms_username");
    setUsername(null);
  }, []);

  return (
    <UsernameContext.Provider value={{ username, saveUsername, isPending: upsertMutation.isPending, clearUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const ctx = useContext(UsernameContext);
  if (!ctx) throw new Error("useUsername must be used within UsernameProvider");
  return ctx;
}
