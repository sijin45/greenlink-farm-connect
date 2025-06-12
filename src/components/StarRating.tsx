
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
}

export const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  showNumber = true,
  reviewCount 
}: StarRatingProps) => {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        className={`${
          i <= rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-gray-200 text-gray-200"
        }`}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} {reviewCount && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
};
