import type { GalleryItem, GenerationResult } from "../types";

interface GalleryProps {
  items: GalleryItem[];
  currentResult: GenerationResult | null;
  onSelect: (item: GalleryItem) => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function extractName(prompt: string): string {
  const words = prompt.split(/\s+/).slice(0, 4).join(" ");
  return words.length > 20 ? words.slice(0, 20) + "..." : words;
}

export default function Gallery({ items, currentResult, onSelect }: GalleryProps) {
  return (
    <div className="gallery">
      <div className="prompt-label">Gallery</div>
      {items.length === 0 && (
        <div className="gallery-empty">Generated logos appear here</div>
      )}
      <div className="gallery-list">
        {items.map((item) => {
          const isActive =
            currentResult?.data === item.data &&
            currentResult?.prompt === item.prompt;

          return (
            <button
              key={item.id}
              className={`gallery-item ${isActive ? "active" : ""}`}
              onClick={() => onSelect(item)}
            >
              <div className="gallery-thumb">
                {item.type === "svg" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.data }}
                    style={{ width: 36, height: 36, overflow: "hidden" }}
                  />
                ) : (
                  <img
                    src={`data:image/png;base64,${item.data}`}
                    alt=""
                    width={36}
                    height={36}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="gallery-info">
                <div className="gallery-name">{extractName(item.prompt)}</div>
                <div className="gallery-meta">
                  {item.type === "svg" ? "SVG" : "Artistic"} · {timeAgo(item.timestamp)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
