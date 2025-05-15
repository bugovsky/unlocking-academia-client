import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic } from "../common/api";
import { Domain, Post } from "../common/types";
import { useAuth } from "./useAuth";

export const usePosts = () => {
  const { user } = useAuth();

  return useQuery<Post[]>({
    queryKey: ["posts", user?.domain],
    queryFn: async () => {
      let domains = user?.domain;
      if (domains === undefined || domains.length == 0) {
        domains = [Domain.MATHEMATICS, Domain.CS, Domain.DB]
      }
      return apiFetchPublic<Post[]>("/post/filter", {
        method: "POST",
        body: JSON.stringify({ domains }),
      });
    },
  });
};

export const usePost = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => apiFetchPublic<Post>(`/post/${postId}`),
  });
};