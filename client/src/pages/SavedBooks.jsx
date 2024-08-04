import React, { useState, useEffect } from 'react';
import { Container, Col, Card, Row, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId, getSavedBookIds } from '../utils/localStorage';
import { deleteBook } from '../utils/API';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;
      if (!token) {
        return false;
      }

      try {
        const response = await fetch('/api/users/me', {
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedSavedBookIds = removeBookId(bookId);
      setSavedBookIds(updatedSavedBookIds);

      // Update userData state to remove the deleted book
      setUserData((prevUserData) => ({
        ...prevUserData,
        savedBooks: prevUserData.savedBooks.filter((book) => book.bookId !== bookId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid className="mt-3 pt-3">
      <h2 className={`search-results-text ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        {userData.savedBooks?.length
          ? `Viewing ${userData.savedBooks.length} favorites:`
          : 'You have no favorited books.'}
      </h2>
      <Row>
        {userData.savedBooks?.map((book, index) => (
          <Col md="12" key={book.bookId || index} className="mb-4">
            <Card className={`horizontal-card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
              <Row className="no-gutters">
                <Col md="2">
                  {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} />}
                </Col>
                <Col md="8">
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className={`small ${darkMode ? 'dark-mode' : 'light-mode'}`}>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                  </Card.Body>
                </Col>
                {Auth.loggedIn() && (
                  <Col md="2" className="d-flex align-items-center justify-content-center">
                    <Button
                      className={`btn-danger ${darkMode ? 'dark-mode' : 'light-mode'}`}
                      onClick={() => handleDeleteBook(book.bookId)}>
                      Remove from Favorites
                    </Button>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
