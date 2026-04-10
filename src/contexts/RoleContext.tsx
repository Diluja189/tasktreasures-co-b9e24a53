import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "manager" | "employee";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

interface RoleContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
}

const mockUsers: Record<UserRole, User> = {
  admin: { id: "1", name: "Alex Richardson", email: "alex@company.com", role: "admin", department: "Executive" },
  manager: { id: "2", name: "Sarah Chen", email: "sarah@company.com", role: "manager", department: "Engineering" },
  employee: { id: "3", name: "James Wilson", email: "james@company.com", role: "employee", department: "Engineering" },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<UserRole>("admin");
  return (
    <RoleContext.Provider value={{ currentUser: mockUsers[role], setRole: setRoleState }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
