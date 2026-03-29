import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  country: string;
  currency: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: UserProfile;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultProfile: UserProfile = { country: "Serbia", currency: "RSD" };

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  profile: defaultProfile,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("country, currency")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile({
        country: data.country ?? "Serbia",
        currency: data.currency ?? "RSD",
      });
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          // Defer to avoid Supabase auth deadlock
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(defaultProfile);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, profile, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
