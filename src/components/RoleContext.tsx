import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "agent";

type RoleCtx = {
  role: Role;
  setRole: (r: Role) => void;
  user: { name: string; email: string };
};

const Ctx = createContext<RoleCtx | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("admin");
  const user = role === "admin"
    ? { name: "Coordinator Adaeze", email: "coord@smartseason.io" }
    : { name: "Amina Yusuf", email: "amina@smartseason.io" };
  return <Ctx.Provider value={{ role, setRole, user }}>{children}</Ctx.Provider>;
};

export const useRole = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRole outside provider");
  return c;
};
