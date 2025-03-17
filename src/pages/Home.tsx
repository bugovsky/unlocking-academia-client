import { useTranslation } from "react-i18next";
import { Navbar } from "../components/layout/Navbar";
import { PostCard } from "../components/ui/PostCard";
import { usePosts } from "../hooks/usePosts";

export const Home = () => {
  const { t } = useTranslation();
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        {isLoading ? (
          <p>{t("home.loading")}</p>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <div key={post.id} className="w-full">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};