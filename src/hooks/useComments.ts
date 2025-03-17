import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic } from "../common/api";
import { Comment } from "../common/types";

export const useComments = (postId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => apiFetchPublic(`/comment/${postId}`),
  });
};