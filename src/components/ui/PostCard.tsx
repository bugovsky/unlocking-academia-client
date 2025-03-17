import { Link } from "@tanstack/react-router";
import { Post } from "../../common/types";

interface PostCardProps {
  post: Post;
}

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const isImageUrl = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="bg-white p-4 rounded-md shadow-md relative block min-h-[200px] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold line-clamp-2">{post.content}</h2>
        <p className="text-gray-600 mt-2">
          Просмотры: {post.views} | Предметы: {post.domain.join(", ")}
        </p>
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-2">
            {isVideoUrl(post.media_urls[0]) ? (
              <video controls className="w-full max-h-40 object-cover">
                <source src={post.media_urls[0]} type="video/mp4" />
              </video>
            ) : isImageUrl(post.media_urls[0]) ? (
              <img
                src={post.media_urls[0]}
                alt="Post media"
                className="w-full max-h-40 object-cover"
              />
            ) : (
              <p className="text-gray-500">Неподдерживаемый формат медиа</p>
            )}
          </div>
        )}
        {post.rating && (
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {post.rating} / 10
          </div>
        )}
      </div>
    </Link>
  );
};