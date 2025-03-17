import { useTranslation } from "react-i18next";
import { Navbar } from "../components/layout/Navbar";
import { RequestForm } from "../components/forms/RequestForm";
import { useExperts } from "../hooks/useUsers";

export const Request = () => {
  const { t } = useTranslation();
  const { data: users, isLoading } = useExperts();

  if (isLoading) return <p>Загрузка пользователей...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t("consultation.title")}</h1>
        <RequestForm users={users || []} />
      </div>
    </div>
  );
};