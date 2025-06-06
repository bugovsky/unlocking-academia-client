import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar";
import { apiFetch } from "../common/api";
import { useAuth } from "../hooks/useAuth";
import { Domain, User } from "../common/types";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { toast } from "react-toastify";

const profileSchema = z.object({
  firstname: z.string().min(1, "Имя обязательно"),
  lastname: z.string().min(1, "Фамилия обязательна"),
  domain: z.array(z.nativeEnum(Domain)).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = () => {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<User>({
    queryKey: ["profile", user?.id],
    queryFn: () => apiFetch<User>(`/user/${user?.id}`),
    enabled: !!user,
  });

  const { register, handleSubmit, watch, reset, formState: { isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      domain: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      apiFetch<User>(`/user/${user?.id}`, {
        method: "PATCH", // Используем PATCH, как в backend
        body: JSON.stringify({
          ...data,
          domain: data.domain?.length ? data.domain : null, // Отправляем null, если домены не выбраны
        }),
      }),
    onSuccess: (updatedUser) => {
      // Обновляем кэш профиля
      queryClient.setQueryData(["profile", user?.id], updatedUser);
      // Сбрасываем форму с новыми данными
      reset({
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        domain: updatedUser.domain || [],
      });
      toast.success("Профиль успешно обновлён");
    },
    onError: (error: any) => {
      const message = `Ошибка: ${error.message || "Не удалось обновить профиль"}`;
      toast.error(message);
    },
  });

  useEffect(() => {
    if (profile) {
      const initial = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        domain: profile.domain || [], // Устанавливаем domain из профиля
      };
      reset(initial);
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => mutation.mutate(data);

  if (authLoading || profileLoading) return <p>Загрузка...</p>;
  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-4">{t("profile.title")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Имя:</label>
            <input
              type="text"
              {...register("firstname")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Фамилия:</label>
            <input
              type="text"
              {...register("lastname")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Предпочитаемые предметы:</label>
            {Object.values(Domain).map((domain) => (
              <div key={domain} className="flex items-center">
                <input
                  type="checkbox"
                  value={domain}
                  {...register("domain")}
                  className="mr-2"
                />
                <label>{domain}</label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white ${
              isDirty ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isDirty || mutation.isPending}
          >
            {mutation.isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
};