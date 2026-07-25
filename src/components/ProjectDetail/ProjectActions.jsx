import {
  Bookmark,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import "./ProjectActions.css";

function ProjectActions({
  liked,
  bookmarked,
  likes = 0,
  comments = 0,
  liveUrl,
  liveLabel = "Live",
  onLike,
  onBookmark,
  onShare,
  onLive,
  onJumpComments,
  layout = "stack",
}) {
  return (
    <div
      className={`pd-actions pd-actions--${layout}`}
      aria-label="Project actions"
    >
      <button
        type="button"
        className={`pd-actions__btn${liked ? " is-on" : ""}`}
        onClick={onLike}
        aria-pressed={liked}
        title="Like"
      >
        <Heart size={15} fill={liked ? "currentColor" : "none"} />
        <span>{likes + (liked ? 1 : 0)}</span>
      </button>

      <button
        type="button"
        className="pd-actions__btn"
        onClick={onJumpComments}
        title="Comments"
      >
        <MessageCircle size={15} />
        <span>{comments || "Comment"}</span>
      </button>

      <button
        type="button"
        className={`pd-actions__btn${bookmarked ? " is-on" : ""}`}
        onClick={onBookmark}
        aria-pressed={bookmarked}
        title="Bookmark"
      >
        <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
        <span>Save</span>
      </button>

      <button
        type="button"
        className="pd-actions__btn"
        onClick={onShare}
        title="Share"
      >
        <Share2 size={15} />
        <span>Share</span>
      </button>

      {liveUrl ? (
        <a
          className="pd-actions__btn pd-actions__btn--link"
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          title={liveLabel}
          onClick={onLive}
        >
          <ExternalLink size={15} />
          <span>{liveLabel}</span>
        </a>
      ) : (
        <button
          type="button"
          className="pd-actions__btn"
          disabled
          title="Live demo unavailable"
        >
          <ExternalLink size={15} />
          <span>{liveLabel}</span>
        </button>
      )}
    </div>
  );
}

export default ProjectActions;
