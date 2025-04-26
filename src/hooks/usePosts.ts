import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic } from "../common/api";
import { Post } from "../common/types";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => apiFetchPublic<Post[]>("/post"),
  });
};

export const usePost = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => apiFetchPublic<Post>(`/post/${postId}`),
  });
};