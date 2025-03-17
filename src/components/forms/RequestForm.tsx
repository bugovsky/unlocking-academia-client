import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../common/api";
import { User } from "../../common/types";

const requestSchema = z.object({
  content: z.string().min(1, "Введите текст запроса"),
  userId: z.string().min(1, "Выберите получателя"),
  type: z.enum(["question", "consultation"]),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestFormProps {
  users: User[];
}

export const RequestForm = ({ users }: RequestFormProps) => {
  const { register, handleSubmit } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RequestFormData) =>
      apiFetch("/request", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  const onSubmit = (data: RequestFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Текст запроса:</label>
        <textarea
          {...register("content")}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block mb-1">Тип запроса:</label>
        <select {...register("type")} className="w-full p-2 border rounded-md">
          <option value="question">Вопрос</option>
          <option value="consultation">Консультация</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Получатель:</label>
        <select
          {...register("userId")}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Выберите получателя</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
};