import { Link } from "@tanstack/react-router";
import { Post } from "../../common/types";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="bg-white p-4 rounded-md shadow-md relative block min-h-[200px] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold line-clamp-2">{post.content}</h2>
        <p className="text-gray-600 mt-2">
          Предметы: {post.domain.join(", ")}
        </p>
        {post.rating && (
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {post.rating} / 10
          </div>
        )}
      </div>
    </Link>
  );
};