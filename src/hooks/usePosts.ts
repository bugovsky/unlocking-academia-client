import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic } from "../common/api";
import { Domain, Post } from "../common/types";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => apiFetchPublic<Post[]>("/post"),
    //queryFn: () => Promise.resolve([{ id: "1", content: "Sample Post", domain: [Domain.CS], views: 10, media_urls: ["sample.mp4"] }]),
  });
};

export const usePost = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => apiFetchPublic<Post>(`/post/${postId}`),
  });
};