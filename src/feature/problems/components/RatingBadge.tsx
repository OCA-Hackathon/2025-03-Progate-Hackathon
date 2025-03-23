"use client";
import { Star, StarHalf } from "lucide-react";
import React from "react";

interface RatingBadgeProps {
  rating: number; // 例: 3, 4.5, 2.5
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="absolute top-1 right-1 flex items-center space-x-0.5 px-2 py-1 rounded text-yellow-400 z-10">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} fill="currentColor" stroke="none" />
      ))}
      {hasHalfStar && <StarHalf size={16} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} stroke="currentColor" fill="none" />
      ))}
    </div>
  );
};

export default RatingBadge;
