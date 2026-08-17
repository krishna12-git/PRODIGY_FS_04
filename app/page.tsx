"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type Post = {
  id: number;
  author: string;
  handle: string;
  initials: string;
  color: string;
  time: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  position?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

const stories = [
  { name: "Your story", initials: "KY", color: "#4c254b", own: true },
  { name: "Aanya", initials: "AS", color: "#ef705d" },
  { name: "Kabir", initials: "KR", color: "#2f665d" },
  { name: "Mira", initials: "MI", color: "#ba5c91" },
  { name: "Dev", initials: "DV", color: "#b77a3d" },
];

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Aanya Shah",
    handle: "@aanyacreates",
    initials: "AS",
    color: "#ef705d",
    time: "18 min",
    caption:
      "Slow mornings, strong coffee, and a fresh page. Sometimes the best ideas arrive when you stop rushing them.",
    tags: ["#morningritual", "#creativeprocess"],
    likes: 248,
    comments: 31,
    position: "0% 0%",
  },
  {
    id: 2,
    author: "Kabir Rao",
    handle: "@kabirwanders",
    initials: "KR",
    color: "#2f665d",
    time: "1 hr",
    caption:
      "No filter needed for evenings like this. Grateful for the people who turn ordinary plans into core memories.",
    tags: ["#goldenhour", "#weekendvibes"],
    likes: 412,
    comments: 54,
    position: "100% 0%",
  },
];

const suggestions = [
  { name: "Mira Iyer", handle: "@miramakes", initials: "MI", color: "#ba5c91" },
  { name: "Dev Patel", handle: "@devframes", initials: "DV", color: "#b77a3d" },
  { name: "Riya Sen", handle: "@riyareads", initials: "RS", color: "#5968a4" },
];

function Avatar({ initials, color, small = false }: { initials: string; color: string; small?: boolean }) {
  return (
    <span className={small ? "avatar avatar-small" : "avatar"} style={{ background: color }}>
      {initials}
    </span>
  );
}

export default function Home() {
  const [postItems, setPostItems] = useState(initialPosts);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({
    1: ["This is such a mood ✨"],
  });
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({ "@kabirwanders": true });
  const [feedMode, setFeedMode] = useState<"for-you" | "following">("for-you");
  const [composerOpen, setComposerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [caption, setCaption] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [profile, setProfile] = useState({
    name: "Krishna Yadav",
    handle: "@krishbuilds",
    bio: "BSc IT student building useful web experiences.",
  });

  const visiblePosts =
    feedMode === "following"
      ? postItems.filter((post) => followed[post.handle] || post.handle === profile.handle)
      : postItems;

  const toggleLike = (postId: number) => {
    setLiked((current) => ({ ...current, [postId]: !current[postId] }));
  };

  const addComment = (event: FormEvent<HTMLFormElement>, postId: number) => {
    event.preventDefault();
    const comment = commentDrafts[postId]?.trim();
    if (!comment) return;
    setCommentsByPost((current) => ({
      ...current,
      [postId]: [...(current[postId] ?? []), comment],
    }));
    setCommentDrafts((current) => ({ ...current, [postId]: "" }));
  };

  const handleMedia = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMediaUrl(URL.createObjectURL(file));
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
  };

  const publishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!caption.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: profile.name,
      handle: profile.handle,
      initials: "KY",
      color: "#4c254b",
      time: "now",
      caption: caption.trim(),
      tags: tagDraft
        .split(/[ ,]+/)
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
      likes: 0,
      comments: 0,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
    };
    setPostItems((current) => [newPost, ...current]);
    setCaption("");
    setTagDraft("");
    setMediaUrl("");
    setComposerOpen(false);
    setFeedMode("for-you");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileOpen(false);
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div>
          <a className="logo" href="#top" aria-label="Circlo home">
            <span className="logo-mark">C</span>
            <span>circlo</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a className="active" href="#top"><span>⌂</span>Home</a>
            <a href="#explore"><span>⌕</span>Explore</a>
            <button type="button" onClick={() => setNotificationsOpen(true)}><span>◌</span>Notifications<i>3</i></button>
            <button type="button" onClick={() => setFeedMode("for-you")}><span>◇</span>Saved</button>
            <button type="button" onClick={() => setProfileOpen(true)}><span>○</span>Profile</button>
          </nav>

          <button className="create-button" type="button" onClick={() => setComposerOpen(true)}>
            Create post <span>+</span>
          </button>
        </div>

        <button className="mini-profile" type="button" aria-label="Open your profile" onClick={() => setProfileOpen(true)}>
          <Avatar initials="KY" color="#4c254b" small />
          <span><strong>{profile.name}</strong><small>{profile.handle}</small></span>
          <b>•••</b>
        </button>
      </aside>

      <section className="feed" id="top">
        <header className="mobile-header">
          <a className="logo" href="#top"><span className="logo-mark">C</span><span>circlo</span></a>
          <button type="button" aria-label="Open notifications" onClick={() => setNotificationsOpen(true)}>◌<i>3</i></button>
        </header>

        <div className="feed-header">
          <div>
            <p>Good evening, {profile.name.split(" ")[0]}</p>
            <h1>See what’s happening.</h1>
          </div>
          <div className="feed-tabs" role="tablist" aria-label="Feed type">
            <button
              className={feedMode === "for-you" ? "active" : ""}
              role="tab"
              aria-selected={feedMode === "for-you"}
              type="button"
              onClick={() => setFeedMode("for-you")}
            >For you</button>
            <button
              className={feedMode === "following" ? "active" : ""}
              role="tab"
              aria-selected={feedMode === "following"}
              type="button"
              onClick={() => setFeedMode("following")}
            >Following</button>
          </div>
        </div>

        <div className="stories" aria-label="Stories">
          {stories.map((story) => (
            <button type="button" className="story" key={story.name}>
              <span className="story-ring">
                <Avatar initials={story.initials} color={story.color} />
                {story.own && <b>+</b>}
              </span>
              <small>{story.name}</small>
            </button>
          ))}
        </div>

        <section className="composer" aria-label="Create a post">
          <Avatar initials="KY" color="#4c254b" />
          <button type="button" className="composer-prompt" onClick={() => setComposerOpen(true)}>Share something with your circle…</button>
          <button type="button" className="quick-photo" aria-label="Add a photo" onClick={() => setComposerOpen(true)}>▧</button>
        </section>

        <div className="post-list">
          {visiblePosts.map((post) => (
            <article className="post-card" key={post.id}>
              <header className="post-header">
                <Avatar initials={post.initials} color={post.color} />
                <div>
                  <h2>{post.author}<span>✓</span></h2>
                  <p>{post.handle} · {post.time}</p>
                </div>
                <button type="button" aria-label="Post options">•••</button>
              </header>

              <p className="caption">{post.caption}</p>
              <div className="tags">
                {post.tags.map((tag) => <a href="#explore" key={tag}>{tag}</a>)}
              </div>

              {post.mediaUrl ? (
                <div className="post-media uploaded-media">
                  {post.mediaType === "video" ? (
                    <video src={post.mediaUrl} controls aria-label={`${post.author}'s video post`} />
                  ) : (
                    <img src={post.mediaUrl} alt={`${post.author}'s post`} />
                  )}
                </div>
              ) : post.position ? (
                <div
                  className="post-media"
                  role="img"
                  aria-label={`${post.author}'s post`}
                  style={{ backgroundPosition: post.position }}
                >
                  <span>Community moment</span>
                </div>
              ) : null}

              <div className="post-stats">
                <span><b>{post.likes + (liked[post.id] ? 1 : 0)}</b> appreciations</span>
                <span>{post.comments + (commentsByPost[post.id]?.length ?? 0)} comments</span>
              </div>
              <div className="post-actions">
                <button
                  className={liked[post.id] ? "liked" : ""}
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  aria-pressed={Boolean(liked[post.id])}
                ><span>{liked[post.id] ? "♥" : "♡"}</span>{liked[post.id] ? "Liked" : "Like"}</button>
                <button
                  type="button"
                  onClick={() => setOpenComments((current) => ({ ...current, [post.id]: !current[post.id] }))}
                  aria-expanded={Boolean(openComments[post.id])}
                ><span>◯</span>Comment</button>
                <button type="button" onClick={() => showToast("Post link copied for sharing")}><span>↗</span>Share</button>
                <button
                  className={`save-action ${saved[post.id] ? "saved" : ""}`}
                  type="button"
                  aria-label={saved[post.id] ? "Remove saved post" : "Save post"}
                  aria-pressed={Boolean(saved[post.id])}
                  onClick={() => setSaved((current) => ({ ...current, [post.id]: !current[post.id] }))}
                >{saved[post.id] ? "◆" : "◇"}</button>
              </div>
              {openComments[post.id] && (
                <section className="comments-panel" aria-label={`Comments on ${post.author}'s post`}>
                  {(commentsByPost[post.id] ?? []).map((comment, index) => (
                    <div className="comment" key={`${post.id}-${index}`}>
                      <Avatar initials={index === 0 && post.id === 1 ? "MI" : "KY"} color={index === 0 && post.id === 1 ? "#ba5c91" : "#4c254b"} small />
                      <p><strong>{index === 0 && post.id === 1 ? "Mira Iyer" : profile.name}</strong>{comment}</p>
                    </div>
                  ))}
                  <form className="comment-form" onSubmit={(event) => addComment(event, post.id)}>
                    <Avatar initials="KY" color="#4c254b" small />
                    <input
                      type="text"
                      value={commentDrafts[post.id] ?? ""}
                      onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                      placeholder="Write a comment…"
                      aria-label={`Write a comment on ${post.author}'s post`}
                    />
                    <button type="submit">Post</button>
                  </form>
                </section>
              )}
            </article>
          ))}
          {visiblePosts.length === 0 && (
            <div className="empty-feed"><strong>Your following feed is quiet.</strong><p>Follow people from the suggestions to see their posts here.</p></div>
          )}
        </div>
      </section>

      <aside className="right-rail" id="explore">
        <label className="global-search">
          <span>⌕</span>
          <input type="search" placeholder="Search Circlo" aria-label="Search Circlo" />
          <kbd>⌘ K</kbd>
        </label>

        <section className="side-card">
          <div className="side-card-title"><h2>People to discover</h2><button type="button">See all</button></div>
          <div className="suggestion-list">
            {suggestions.map((person) => (
              <div className="suggestion" key={person.handle}>
                <Avatar initials={person.initials} color={person.color} small />
                <span><strong>{person.name}</strong><small>{person.handle}</small></span>
                <button
                  className={followed[person.handle] ? "following" : ""}
                  type="button"
                  onClick={() => {
                    setFollowed((current) => ({ ...current, [person.handle]: !current[person.handle] }));
                    showToast(followed[person.handle] ? `Unfollowed ${person.name}` : `Following ${person.name}`);
                  }}
                >{followed[person.handle] ? "Following" : "Follow"}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="side-card trend-card">
          <div className="side-card-title"><h2>Trending now</h2><span>Live</span></div>
          <a href="#top"><small>Design · Trending</small><strong>#BuildInPublic</strong><span>2.4k posts</span></a>
          <a href="#top"><small>Mumbai · Trending</small><strong>#MumbaiMonsoon</strong><span>8.7k posts</span></a>
          <a href="#top"><small>Technology · Trending</small><strong>React 19</strong><span>4.1k posts</span></a>
        </section>

        <p className="side-footer">About · Help · Privacy · Terms<br />© 2026 Circlo Social</p>
      </aside>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <a className="active" href="#top">⌂<small>Home</small></a>
        <a href="#explore">⌕<small>Explore</small></a>
        <button type="button" className="mobile-create" onClick={() => setComposerOpen(true)} aria-label="Create post">+</button>
        <button type="button" onClick={() => setNotificationsOpen(true)}>◌<small>Alerts</small><i>3</i></button>
        <button type="button" onClick={() => setProfileOpen(true)}>○<small>Profile</small></button>
      </nav>

      {composerOpen && (
        <div className="modal-layer" role="presentation">
          <button className="modal-backdrop" type="button" aria-label="Close create post" onClick={() => setComposerOpen(false)} />
          <section className="modal-card composer-modal" role="dialog" aria-modal="true" aria-labelledby="create-post-title">
            <header className="modal-header">
              <div><p>Create</p><h2 id="create-post-title">Share with your circle</h2></div>
              <button type="button" onClick={() => setComposerOpen(false)} aria-label="Close">×</button>
            </header>
            <form onSubmit={publishPost}>
              <div className="composer-identity">
                <Avatar initials="KY" color="#4c254b" />
                <span><strong>{profile.name}</strong><small>{profile.handle}</small></span>
              </div>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={5}
                maxLength={400}
                placeholder="What would you like to share?"
                aria-label="Post caption"
                required
              />
              {mediaUrl && (
                <div className="media-preview">
                  {mediaType === "video" ? <video src={mediaUrl} controls /> : <img src={mediaUrl} alt="Upload preview" />}
                  <button type="button" onClick={() => setMediaUrl("")} aria-label="Remove media">×</button>
                </div>
              )}
              <label className="tag-input">
                <span>#</span>
                <input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} placeholder="Add tags: design, coding, travel" />
              </label>
              <div className="modal-actions">
                <label className="upload-button">
                  <input type="file" accept="image/*,video/*" onChange={handleMedia} />
                  <span>▧</span> Photo or video
                </label>
                <span className="character-count">{caption.length}/400</span>
                <button className="publish-button" type="submit">Publish post</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {profileOpen && (
        <div className="modal-layer" role="presentation">
          <button className="modal-backdrop" type="button" aria-label="Close profile editor" onClick={() => setProfileOpen(false)} />
          <section className="modal-card profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <header className="modal-header">
              <div><p>Your profile</p><h2 id="profile-title">Make it yours</h2></div>
              <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close">×</button>
            </header>
            <div className="profile-cover"><Avatar initials="KY" color="#4c254b" /></div>
            <form className="profile-form" onSubmit={saveProfile}>
              <label>Display name<input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required /></label>
              <label>Username<input value={profile.handle} onChange={(event) => setProfile((current) => ({ ...current, handle: event.target.value.startsWith("@") ? event.target.value : `@${event.target.value}` }))} required /></label>
              <label>Bio<textarea rows={3} value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} /></label>
              <button className="publish-button" type="submit">Save profile</button>
            </form>
          </section>
        </div>
      )}

      {notificationsOpen && (
        <div className="modal-layer notification-layer" role="presentation">
          <button className="modal-backdrop" type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} />
          <aside className="notification-panel" role="dialog" aria-modal="true" aria-labelledby="notification-title">
            <header className="modal-header"><div><p>Updates</p><h2 id="notification-title">Notifications</h2></div><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close">×</button></header>
            <div className="notification-list">
              <article><Avatar initials="AS" color="#ef705d" small /><p><strong>Aanya Shah</strong> liked your latest project update.<span>12 minutes ago</span></p><i /></article>
              <article><Avatar initials="MI" color="#ba5c91" small /><p><strong>Mira Iyer</strong> started following you.<span>1 hour ago</span></p><i /></article>
              <article><Avatar initials="KR" color="#2f665d" small /><p><strong>Kabir Rao</strong> mentioned you in a comment.<span>Yesterday</span></p><i /></article>
            </div>
          </aside>
        </div>
      )}

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
