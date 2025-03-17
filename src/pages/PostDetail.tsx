import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../common/api";
import { useAuth } from "../hooks/useAuth";
import { Comment, Post, User } from "../common/types";
import { Navbar } from "../components/layout/Navbar";
import { useTranslation } from "react-i18next";
import { useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

interface CommentFormData {
  content: string;
}

interface RatingFormData {
  grade: number;
}

interface RatingResponse {
  grade: number;
  post_id?: string;
}

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const isImageUrl = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

export const PostDetail = () => {
  const { t } = useTranslation();
  const { postId } = useParams({ from: "/post/$postId" });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => apiFetch<Post>(`/post/${postId}`),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => apiFetch<Comment[]>(`/comment/${postId}`),
  });

  const { data: averageRating, isLoading: ratingLoading } = useQuery<number | null>({
    queryKey: ["rating", postId],
    queryFn: async () => {
      const response = await apiFetch<RatingResponse | null>(`/rating/${postId}`);
      return response ? response.grade : null;
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      const newComment = await apiFetch<Comment>(`/comment/${postId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const author = await apiFetch<User>(`/user/${newComment.author_id}`);
      return { ...newComment, firstname: author.firstname, lastname: author.lastname, role: author.role };
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) => [
        ...old,
        newComment,
      ]);
      resetComment();
    },
  });

  const ratingMutation = useMutation({
    mutationFn: (data: RatingFormData) =>
      apiFetch<RatingResponse>(`/rating/${postId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", postId] });
      resetRating();
    },
    onError: (error, data) => {
      if (error.message.includes("409")) {
        updateRatingMutation.mutate(data);
      }
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: (data: RatingFormData) =>
      apiFetch<RatingResponse>(`/rating/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", postId] });
      resetRating();
    },
  });

  const { register: registerComment, handleSubmit: handleCommentSubmit, reset: resetComment } =
    useForm<CommentFormData>();
  const { register: registerRating, handleSubmit: handleRatingSubmit, reset: resetRating } =
    useForm<RatingFormData>();

  const onSubmitComment = (data: CommentFormData) => commentMutation.mutate(data);
  const onSubmitRating = (data: RatingFormData) => ratingMutation.mutate(data);

  if (postLoading || commentsLoading || ratingLoading) return <p>Загрузка...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        {post && (
          <>
            <div className="bg-white p-4 rounded-md shadow-md flex flex-col">
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{post.content}</h1>
                <p className="text-gray-600">
                  Просмотры: {post.views} | Предметы: {post.domain.join(", ")}
                </p>
                {post.media_urls && post.media_urls.map((url, index) => (
                  <div key={index} className="mt-2">
                    {isVideoUrl(url) ? (
                      <video controls className="w-full">
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : isImageUrl(url) ? (
                      <img src={url} alt="Post media" className="w-full object-cover" />
                    ) : (
                      <p className="text-gray-500">Неподдерживаемый формат медиа</p>
                    )}
                  </div>
                ))}
              </div>
              {averageRating && (
                <div className="mt-4 text-sm text-gray-500 text-right">
                  Оценка: {averageRating} / 10
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold">{t("post.comments")}</h2>
              {!comments || comments.length === 0 ? (
                <p>Комментариев пока нет</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-200 p-2 mt-2 rounded-md">
                    {comment.firstname && comment.lastname ? (
                      <p className="font-semibold">
                        {comment.firstname} {comment.lastname}
                        {comment.role === "admin" && " (Администратор)"}
                      </p>
                    ) : (
                      <p className="font-semibold">Автор неизвестен</p>
                    )}
                    <p>{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {user && (
              <>
                <form onSubmit={handleCommentSubmit(onSubmitComment)} className="mt-4">
                  <textarea
                    {...registerComment("content", { required: true })}
                    placeholder={t("post.writeComment")}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    disabled={commentMutation.isPending}
                  >
                    {t("post.submitComment")}
                  </button>
                </form>

                <form onSubmit={handleRatingSubmit(onSubmitRating)} className="mt-4">
                  <label className="block mb-1">{t("post.rating")}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    {...registerRating("grade", { required: true, min: 0, max: 10 })}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    disabled={ratingMutation.isPending}
                  >
                    {t("post.submitRating")}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};