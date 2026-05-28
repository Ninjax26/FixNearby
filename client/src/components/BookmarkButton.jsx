// client/src/components/BookmarkButton.jsx

import { useState } from "react";
import { toggleFavorite } from "../services/favoriteService";

const BookmarkButton = ({ workerId, initialBookmarked = false, onToggle }) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation(); // prevent card click
    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      await toggleFavorite(workerId, bookmarked);
      setBookmarked((prev) => !prev);
      if (onToggle) onToggle(workerId, !bookmarked);
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      alert("Failed to update bookmark. Please login first.");
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 400);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={bookmarked ? "Remove from Saved" : "Save Worker"}
      style={{
        background: bookmarked
          ? "linear-gradient(135deg, #ff6b35, #f7931e)"
          : "rgba(255,255,255,0.15)",
        border: bookmarked ? "none" : "1.5px solid #ccc",
        borderRadius: "50px",
        padding: "6px 14px",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: bookmarked ? "#fff" : "#555",
        transition: "all 0.3s ease",
        transform: animating ? "scale(1.2)" : "scale(1)",
        boxShadow: bookmarked ? "0 4px 12px rgba(255,107,53,0.4)" : "none",
        backdropFilter: "blur(8px)",
        letterSpacing: "0.3px",
      }}
    >
      <span
        style={{
          fontSize: "16px",
          transition: "transform 0.3s ease",
          display: "inline-block",
          transform: animating ? "rotate(20deg)" : "rotate(0deg)",
        }}
      >
        {bookmarked ? "🔖" : "🤍"}
      </span>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
};

export default BookmarkButton;