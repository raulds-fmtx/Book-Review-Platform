import { openDB } from 'idb';

// Open or create the IndexedDB database
const initDB = async () => {
  return openDB('book-review-db', 1, {
    upgrade(db) {
      db.createObjectStore('cart', { keyPath: '_id' });
      db.createObjectStore('savedBooks', { keyPath: 'bookId' });
    },
  });
};

// Save data to IndexedDB
export const idbPromise = async (storeName, method, object) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  let result;
  switch (method) {
    case 'put':
      result = await store.put(object);
      break;
    case 'get':
      result = await store.get(object);
      break;
    case 'delete':
      result = await store.delete(object);
      break;
    case 'clear':
      result = await store.clear();
      break;
    default:
      throw new Error('Invalid method');
  }

  await tx.done;
  return result;
};

// Get saved book IDs from localStorage
export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];
  return savedBookIds;
};

// Save book IDs to localStorage
export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

// Remove a book ID from localStorage
export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
