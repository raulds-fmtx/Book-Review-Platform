// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
const googleBooksApiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export const searchGoogleBooks = (query) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`
  );
};

export const createPaymentIntent = () => {
  return fetch("/api/checkout/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 1000 }), // amount in cents
  });
};