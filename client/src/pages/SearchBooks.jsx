import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveBook, searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.add('light-mode');
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  useEffect(() => {
    const handleScroll = () => {
      const searchHeader = document.querySelector('.search-header');
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      if (window.scrollY > navbarHeight) {
        searchHeader.classList.add('fixed-top');
      } else {
        searchHeader.classList.remove('fixed-top');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBook(bookToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <>
      <div className={`search-header d-flex justify-content-between align-items-center p-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <h1><Link to="/" className="no-underline">BookBuddy 📚</Link></h1>
        <Form onSubmit={handleFormSubmit} className="d-flex search-form">
          <Form.Control
            name='searchInput'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type='text'
            size='lg'
            placeholder='Search by Title / Author / Keyword or ISBN'
            className={`rounded-left ${darkMode ? 'dark-mode' : 'light-mode'}`}
          />
          <Button type='submit' variant='success' size='lg' className={`rounded-right ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            Search
          </Button>
        </Form>
        <button onClick={toggleDarkMode} className="toggle-button">
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
      <Container className="mt-3 pt-3">
        <h2 className={`search-results-text ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="12" key={book.bookId} className="mb-4">
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
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className={`btn-info ${darkMode ? 'dark-mode' : 'light-mode'}`}
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
