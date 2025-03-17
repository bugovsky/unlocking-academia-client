interface VideoProps {
    url: string;
  }
  
  export const Video = ({ url }: VideoProps) => {
    return (
      <div className="mt-4">
        <video controls className="w-full rounded-lg">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };