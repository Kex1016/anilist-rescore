import { Entry } from "@/types/UserData";
import { Skeleton } from "@/components/ui/skeleton";

type MediaCardProps = {
  entry: Entry;
  onClick?: () => void;
};

function MediaCard({ entry, onClick }: MediaCardProps) {
  const mediaFormat = (entry.media.format || "Unknown").replace("_", " ");

  return (
    <div
      className="card aspect-card w-32 relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="card-image w-full h-full">
        <figure className="image w-full h-full">
          {/* Blurhash */}
          <Skeleton
            id={`entry-${entry.id}`}
            className="w-full h-full rounded-lg"
          />
          <img
            src={entry.media.coverImage.extraLarge}
            alt={entry.media.title.userPreferred}
            className="w-full h-full object-cover rounded-lg overflow-clip"
            loading="lazy"
            id={`entry-${entry.id}-image`}
            // while loading, hide
            style={{
              width: "0",
              height: "0",
            }}
            // when loaded, remove the blurhash
            onLoad={() => {
              const skeleton = document.getElementById(
                `entry-${entry.id}`
              ) as HTMLDivElement;
              skeleton.style.display = "none";

              const image = document.getElementById(
                `entry-${entry.id}-image`
              ) as HTMLImageElement;
              image.style.width = "100%";
              image.style.height = "100%";
            }}
          />
        </figure>
      </div>
      {/* Floating on card, the title and type of the entry */}
      <div className="card-header absolute bottom-0 left-0 bg-background/50 backdrop-blur-md w-full rounded-b-lg px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <div className="card-title line-clamp-1 text-md font-bold">
          {entry.media.title.userPreferred}
        </div>
        <div className="card-subtitle text-sm">{mediaFormat}</div>
      </div>
    </div>
  );
}

export default MediaCard;
