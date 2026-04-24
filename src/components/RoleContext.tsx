import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/lib/api";

export type Role = "ADMIN" | "FIELD_AGENT";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type RoleCtx = {
  role: "admin" | "agent" | null;
  user: UserType | null;
  login: (token: string, u: UserType) => void;
  logout: () => void;
  setRole: (role: "admin" | "agent") => void;
};

const Ctx = createContext<RoleCtx | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (token: string, u: UserType) => {
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    setUser(null);
  };

  const setRole = (newRole: "admin" | "agent") => {
    if (user) {
      const updatedUser = { ...user, role: newRole === "admin" ? "ADMIN" : "FIELD_AGENT" } as UserType;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const role = user ? (user.role === "ADMIN" ? "admin" : "agent") : null;

  return <Ctx.Provider value={{ role, user, login, logout, setRole }}>{children}</Ctx.Provider>;
};

export const useRole = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRole outside provider");
  return c;
};
