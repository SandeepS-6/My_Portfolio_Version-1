import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProjectById,
  likeProject,
  postProjectComment,
  recordProjectView,
} from "../services/projects";
import { CASE_SECTIONS } from "../utils/ProjectDetail/caseStudyNav";
import ProjectToc from "../components/ProjectDetail/ProjectToc";
import ProjectInfoPanel from "../components/ProjectDetail/ProjectInfoPanel";
import ProjectCaseStudy from "../components/ProjectDetail/ProjectCaseStudy";
import ProjectActions from "../components/ProjectDetail/ProjectActions";
import ProjectNav from "../components/ProjectDetail/ProjectNav";
import "./ProjectDetail.css";

function likedStorageKey(id) {
  return `project-liked:${id}`;
}

function ProjectDetailPage() {
  const { id } = useParams();
  const [payload, setPayload] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(CASE_SECTIONS[0].id);
  const [liked, setLiked] = useState(
    () => sessionStorage.getItem(likedStorageKey(id)) === "1",
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentSort, setCommentSort] = useState("newest");
  const [commentDraft, setCommentDraft] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const rootRef = useRef(null);
  const viewedRef = useRef(null);

  useEffect(() => {
    setPayload(null);
    setMissing(false);
    setLoading(true);
    setLiked(sessionStorage.getItem(likedStorageKey(id)) === "1");
    setBookmarked(false);
    setCommentDraft("");
    setCommentPage(1);
    setActiveId(CASE_SECTIONS[0].id);
    setComments([]);
    setLikesCount(0);
    window.scrollTo(0, 0);

    let alive = true;
    getProjectById(id)
      .then((data) => {
        if (!alive) return;
        if (!data) {
          setMissing(true);
          setPayload(null);
          return;
        }
        setPayload(data);
        setComments(data.project.comments || []);
        setLikesCount(data.project.meta?.likes ?? 0);
        setMissing(false);
      })
      .catch((error) => {
        if (!alive) return;
        console.warn("[projects] Failed to load project.", error.message);
        setMissing(true);
        setPayload(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    const name = payload?.project?.name;
    const seoTitle = payload?.project?.seo?.title || name;
    if (!seoTitle) return undefined;

    const previous = document.title;
    document.title = seoTitle;

    const description =
      payload?.project?.seo?.description ||
      payload?.project?.shortDescription ||
      "";
    let meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") || "";
    if (description) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previous;
      if (meta) meta.setAttribute("content", previousDescription);
    };
  }, [payload]);

  useEffect(() => {
    if (!id || missing || loading || viewedRef.current === id) return undefined;
    viewedRef.current = id;
    recordProjectView(id).catch(() => {});
    return undefined;
  }, [id, missing, loading]);

  useEffect(() => {
    if (!payload) return undefined;

    const nodes = CASE_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter(Boolean);

    if (!nodes.length) return undefined;

    function syncActive() {
      const marker = window.scrollY + window.innerHeight * 0.28;
      let current = nodes[0].id;

      for (const node of nodes) {
        if (node.offsetTop <= marker) current = node.id;
        else break;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [payload]);

  const toast = useMemo(() => (copied ? "Link copied" : ""), [copied]);

  function shareProject(name) {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: name, url }).catch(() => {});
      return;
    }
    copyLink();
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function jumpComments() {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  }

  async function toggleLike() {
    const undo = liked;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((count) => Math.max(0, count + (undo ? -1 : 1)));
    sessionStorage.setItem(likedStorageKey(id), nextLiked ? "1" : "0");

    try {
      const data = await likeProject(id, { undo });
      if (typeof data?.likes === "number") setLikesCount(data.likes);
    } catch {
      setLiked(undo);
      setLikesCount((count) => Math.max(0, count + (undo ? 1 : -1)));
      sessionStorage.setItem(likedStorageKey(id), undo ? "1" : "0");
    }
  }

  async function submitComment() {
    const body = commentDraft.trim();
    if (!body) return;

    const optimistic = {
      id: `local-${Date.now()}`,
      name: "You",
      avatar: "YO",
      date: "Just now",
      body,
      likes: 0,
      replies: [],
    };
    setComments((prev) => [optimistic, ...prev]);
    setCommentDraft("");
    setCommentPage(1);

    try {
      const saved = await postProjectComment(id, { name: "You", body });
      setComments((prev) =>
        prev.map((item) => (item.id === optimistic.id ? saved : item)),
      );
    } catch {
      setComments((prev) => prev.filter((item) => item.id !== optimistic.id));
    }
  }

  if (loading) {
    return (
      <main className="project-detail project-detail--missing">
        <p>Loading project…</p>
      </main>
    );
  }

  if (missing || !payload) {
    return (
      <main className="project-detail project-detail--missing">
        <p>Project not found.</p>
        <Link to="/#projects">Back to projects</Link>
      </main>
    );
  }

  const {
    project,
    prev,
    next,
    related = [],
    projects = [],
    labels,
    kinds,
    squircle = {},
  } = payload;

  const squircleOn = squircle.enabled !== false;
  const squircleRadius = squircle.radius || "1.35rem";

  const actionProps = {
    liked,
    bookmarked,
    likes: likesCount,
    comments: comments.length,
    liveUrl: project.liveUrl,
    liveLabel: labels.live || "Live",
    onLike: toggleLike,
    onBookmark: () => setBookmarked((value) => !value),
    onShare: () => shareProject(project.name),
    onJumpComments: jumpComments,
  };

  const infoProps = {
    project,
    labels,
    projects,
    prev,
    next,
    ...actionProps,
  };

  return (
    <main
      ref={rootRef}
      className="project-detail"
      data-squircle={squircleOn ? "true" : "false"}
      style={{ "--projects-squircle-radius": squircleRadius }}
    >
      <div className="project-detail__shell">
        <ProjectToc
          activeId={activeId}
          open={tocOpen}
          onToggle={setTocOpen}
          project={project}
          projects={projects}
          prev={prev}
          next={next}
        />

        <div className="project-detail__main">
          <ProjectCaseStudy
            project={project}
            labels={labels}
            kinds={kinds}
            related={related}
            comments={comments}
            commentSort={commentSort}
            onCommentSort={setCommentSort}
            commentDraft={commentDraft}
            onCommentDraft={setCommentDraft}
            onCommentSubmit={submitComment}
            commentPage={commentPage}
            onCommentPage={setCommentPage}
          />

          <ProjectNav prev={prev} next={next} labels={labels} />
        </div>

        <div className="pd-info-rail">
          <ProjectInfoPanel {...infoProps} />
        </div>
      </div>

      <div className="pd-actions-dock">
        <ProjectActions layout="dock" {...actionProps} />
      </div>

      {toast ? <p className="project-detail__toast">{toast}</p> : null}
    </main>
  );
}

export default ProjectDetailPage;
