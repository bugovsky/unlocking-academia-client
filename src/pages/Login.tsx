import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import { login } from "../common/auth";
import { Navbar } from "../components/layout/Navbar";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginFormData) => login(email, password),
    onSuccess: () => navigate({ to: "/" }),
    onError: (error: any) => {
      const message =
        error.status === 401
          ? "Неверный email или пароль"
          : error.status === 403
          ? "Доступ запрещен"
          : `Ошибка: ${error.message || "Не удалось войти"}`;
      toast.error(message);
    },
  });

  const onSubmit = (data: LoginFormData) => mutation.mutate(data);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-4">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Пароль:</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Вход..." : "Войти"}
          </button>
          <div className="mt-2">
            <Link to="/register" className="text-blue-500 hover:underline">
              Ещё не зарегистрированы?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};