import { useQuery } from "@tanstack/react-query";
import { apiFetchPublic, apiFetch } from "../common/api";
import { Comment, User } from "../common/types";

export const useComments = (postId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const comments = await apiFetchPublic<Comment[]>(`/comment/${postId}`);
      
      const commentsWithAuthor = await Promise.all(
        comments.map(async (comment) => {
          try {
            const author = await apiFetch<User>(`/user/${comment.author_id}`);
            return {
              ...comment,
              firstname: author.firstname,
              lastname: author.lastname,
              role: author.role,
            };
          } catch (error) {
            return comment;
          }
        })
      );

      return commentsWithAuthor;
    },
  });
};