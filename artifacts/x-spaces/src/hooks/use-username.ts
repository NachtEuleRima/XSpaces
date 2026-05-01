import { useState, useEffect } from "react";
import { useUpsertVisitor } from "@workspace/api-client-react";

export function useUsername() {
  const [username, setUsername] = useState<string | null>(null);
  const upsertMutation = useUpsertVisitor();

  useEffect(() => {
    const saved = localStorage.getItem("xcoms_username");
    if (saved) setUsername(saved);
  }, []);

  const saveUsername = async (newUsername: string, spaceId?: number) => {
    // Strip @ if they included it
    const cleanUsername = newUsername.replace(/^@/, "");
    
    try {
      await upsertMutation.mutateAsync({
        data: { username: cleanUsername, spaceId }
      });
      localStorage.setItem("xcoms_username", cleanUsername);
      setUsername(cleanUsername);
      return true;
    } catch (e) {
      console.error("Failed to save username", e);
      return false;
    }
  };

  return {
    username,
    saveUsername,
    isPending: upsertMutation.isPending
  };
}
