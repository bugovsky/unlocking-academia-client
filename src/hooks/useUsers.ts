import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic } from "../common/api";
import { User } from "../common/types";

export const useExperts = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => apiFetchPublic("/user/experts"),
  });
};