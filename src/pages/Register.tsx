import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { register } from "../common/auth";
import { Navbar } from "../components/layout/Navbar";

const registerSchema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  firstname: z.string().min(1, "Имя обязательно"),
  lastname: z.string().min(1, "Фамилия обязательна"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const { register: formRegister, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password, firstname, lastname }: RegisterFormData) =>
      register(email, password, firstname, lastname),
    onSuccess: () => navigate({ to: "/" }),
  });

  const onSubmit = (data: RegisterFormData) => mutation.mutate(data);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-4">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              {...formRegister("email")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Пароль:</label>
            <input
              type="password"
              {...formRegister("password")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Имя:</label>
            <input
              type="text"
              {...formRegister("firstname")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Фамилия:</label>
            <input
              type="text"
              {...formRegister("lastname")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
};