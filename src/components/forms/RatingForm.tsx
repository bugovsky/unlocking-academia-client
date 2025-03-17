import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../common/api";
import { Rating } from "../../common/types";

const ratingSchema = z.object({
  grade: z.number().min(0).max(10),
});

type RatingFormData = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  postId: string;
}

export const RatingForm = ({ postId }: RatingFormProps) => {
  const { register, handleSubmit, reset } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: { grade: 5 },
  });

  const mutation = useMutation({
    mutationFn: (data: RatingFormData) =>
      apiFetch<Rating>(`/rating/${postId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => reset(),
  });

  const onSubmit = (data: RatingFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <label className="block mb-2">
        Rating (0-10):
        <input
          type="number"
          {...register("grade", { valueAsNumber: true })}
          className="w-full p-2 border rounded-md"
          min={0}
          max={10}
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Submitting..." : "Submit Rating"}
      </button>
    </form>
  );
};