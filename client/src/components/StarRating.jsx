import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { RATE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries"

const StarRating = ({ bookId, currentRating }) => {
  const [rating, setRating] = useState(currentRating);

  // Use the useMutation hook with the RATE_BOOK mutation
  const [rateBook] = useMutation(RATE_BOOK);

  useEffect( () => {
    // Update the rating state if currentRating prop changes
    setRating(currentRating);
  }, [currentRating]);

  const handleClick = async (index) => {
    const newRating = index + 1;
    setRating(newRating);

    // Perform the mutation
    rateBook({
      variables: {
        bookId: bookId,
        rating: newRating,
      },
    })
      .then((response) => {
        console.log("Rating submitted successfully:", response);
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
  };

  return (
    <div style={{ display: "flex", cursor: "pointer" }}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          filled={index < rating}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

const Star = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    style={{ fontSize: "2rem", color: filled ? "#FFD700" : "#e0e0e0" }}
  >
    {filled ? "★" : "☆"}
  </span>
);

export default StarRating;