import { Heart, MessageCircle, Send } from "lucide-react";
import "./ProjectComments.css";

const PAGE_SIZE = 2;

function ProjectComments({
  comments = [],
  sort = "newest",
  onSort,
  draft,
  onDraft,
  onSubmit,
  page = 1,
  onPage,
}) {
  const sorted = [...comments].sort((a, b) => {
    if (sort === "popular") return (b.likes || 0) - (a.likes || 0);
    return String(b.date).localeCompare(String(a.date));
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section id="comments" className="pd-comments" data-detail-block>
      <div className="pd-comments__head">
        <h2>
          <MessageCircle size={18} aria-hidden="true" />
          Comments
        </h2>
        <label className="pd-comments__sort">
          <span className="visually-hidden">Sort comments</span>
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="popular">Most liked</option>
          </select>
        </label>
      </div>

      <form
        className="pd-comments__composer"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="pd-comments__avatar" aria-hidden="true">
          You
        </div>
        <div className="pd-comments__composer-body">
          <textarea
            value={draft}
            onChange={(event) => onDraft(event.target.value)}
            placeholder="Share a thoughtful note about this case study…"
            rows={3}
          />
          <button type="submit" disabled={!draft.trim()}>
            <Send size={14} />
            Post comment
          </button>
        </div>
      </form>

      {slice.length === 0 ? (
        <div className="pd-comments__empty">
          <p>No comments yet</p>
          <span>Be the first to leave a note on this project.</span>
        </div>
      ) : (
        <ul className="pd-comments__list">
          {slice.map((comment) => (
            <li key={comment.id} className="pd-comments__card">
              <div className="pd-comments__avatar" aria-hidden="true">
                {comment.avatar}
              </div>
              <div className="pd-comments__body">
                <div className="pd-comments__meta">
                  <strong>{comment.name}</strong>
                  <time>{comment.date}</time>
                </div>
                <p>{comment.body}</p>
                <div className="pd-comments__tools">
                  <button type="button">
                    <Heart size={13} />
                    {comment.likes || 0}
                  </button>
                  <button type="button">Reply</button>
                </div>

                {(comment.replies || []).length > 0 ? (
                  <ul className="pd-comments__replies">
                    {comment.replies.map((reply) => (
                      <li key={reply.id}>
                        <div className="pd-comments__avatar pd-comments__avatar--sm">
                          {reply.avatar}
                        </div>
                        <div>
                          <div className="pd-comments__meta">
                            <strong>{reply.name}</strong>
                            <time>{reply.date}</time>
                          </div>
                          <p>{reply.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="pd-comments__pager">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPage(safePage - 1)}
          >
            Previous
          </button>
          <span>
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPage(safePage + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default ProjectComments;
