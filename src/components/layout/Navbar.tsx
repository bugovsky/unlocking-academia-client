import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          {t("nav.brand")}
        </Link>
        <div className="space-x-6">
          {isAuthenticated && (
            <Link to="/request" className="text-white hover:underline">
              {t("nav.consultation")}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white hover:underline">
                {t("nav.profile")}
              </Link>
              <button onClick={handleLogout} className="text-white hover:underline">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:underline">
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};