import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import StarRating from "../components/StarRating";
import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { removeBookId, getSavedBookIds } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  console.log(data);
  const [removeBook] = useMutation(REMOVE_BOOK);
  // const [userData, setUserData] = useState({});
  // const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data: updatedUser } = await removeBook({
        variables: { bookId }
      });

      if (!updatedUser) {
        throw new Error('something went wrong!');
      }

      // Upon success, remove book's id from localStorage
      removeBookId(bookId);
      
    } catch (err) {
      console.error(err);
    }
  };

  // Loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Handle error state
  if (error) {
    return <h2>Error loading saved books!</h2>;
  }

  // Extract userData from query data
  const userData = data?.me;

  if (!userData || !userData.savedBooks) {
    return <h2>No saved books found!</h2>;
  }
  
  return (
    <Container fluid className="mt-3 pt-3">
      <h2
        className={`search-results-text ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
      >
        {userData.savedBooks?.length
          ? `Viewing ${userData.savedBooks.length} favorites:`
          : "You have no favorited books."}
      </h2>
      <Row>
        {userData.savedBooks?.map((book, index) => (
          <Col md="12" key={book.bookId || index} className="mb-4">
            <Card
              className={`horizontal-card ${
                darkMode ? "dark-mode" : "light-mode"
              }`}
            >
              <Row className="no-gutters">
                <Col md="4">
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                    />
                  )}
                </Col>
                <Col md="8">
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p
                      className={`small ${
                        darkMode ? "dark-mode" : "light-mode"
                      }`}
                    >
                      Authors: {book.authors.join(", ")}
                    </p>
                    <Card.Text>{book.description}</Card.Text>
                    <Card.Title>Rate this book:</Card.Title>
                    <StarRating
                      bookId={book.bookId}
                      currentRating={book.rating}
                    />
                    <Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          className={`btn-danger ${
                            darkMode ? "dark-mode" : "light-mode"
                          }`}
                          onClick={() => handleDeleteBook(book.bookId)}
                        >
                          Remove from Favorites
                        </Button>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
