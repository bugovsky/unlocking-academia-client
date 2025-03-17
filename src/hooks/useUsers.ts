import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../common/api";
import { User, Role } from "../common/types";

export const useExperts = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    // queryFn: () => apiFetch("/user?role=expert"),
    queryFn: () => Promise.resolve([{ id: "expert1", firstname: "John", lastname: "Doe", email: "john@example.com", role: Role.EXPERT }]),
  });
};