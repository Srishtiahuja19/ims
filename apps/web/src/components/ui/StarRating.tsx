import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (rating: number) => {
        if (!readonly && onChange) {
            onChange(rating);
        }
    };

    const displayRating = hoverRating || value;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    disabled={readonly}
                    className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    <Star
                        className={`w-6 h-6 ${star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/20'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
}
