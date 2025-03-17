import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../common/api";
import { Comment } from "../../common/types";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CommentFormData) =>
      apiFetch<Comment>(`/comment?post_id=${postId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => reset(),
  });

  const onSubmit = (data: CommentFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <textarea
        {...register("content")}
        className="w-full p-2 border rounded-md"
        placeholder="Write your comment..."
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
};