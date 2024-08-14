# Book Buddy

## Description

Book Buddy refactors an existing Google Books API search engine from a RESTful API to a GraphQL API using Apollo Server. This application provides users with a streamlined way to search for books and sign up for an account that will enable them to save their favorite books and manage their favorites' list. The transition from REST to GraphQL allows for more precise data queries, reducing the amount of unnecessary data transfer and improving the app's responsiveness. The  also allows for donations to help improve the site.

## Installation

To get the development environment running, follow these steps:

**Clone the Repository:**

git clone https://github.com/your-username/google-books-search-engine.git

**Install Dependencies:**

Navigate to the root directory and install dependencies:

npm install

**Set Up Environment Variables:**

Create a .env file in the root directory and add your MongoDB Atlas URI and any other necessary environment variables, such as your JWT secret.

**Start the Application:**

In the root directory, run the following command to start both the client and server:

npm run develop

## Usage

[Link to Deployed Application](https://book-review-platform-rwen.onrender.com/)

To use the application, follow these steps:

**Search for Books:**

On the homepage, use the search bar to find books by title or keyword.

**View Search Results:**

The results will display the book’s title, author, description, image, rating, and reviews.

**Save Books to Your Account:**

If logged in, click the "Add to favorites" button on any book to add it to your saved books list.

**View Saved Books:**

Navigate to the "Favorites" section to view all books you've saved.

**Remove Books:**

From the "Favorites" section, click "Remove from favorites" to delete a book from your saved list.

**User Authentication:**

Use the Login/Signup option to create an account or log in. Upon successful login, you'll have access to saving books and viewing your saved list.

**Donations**

Click on "Donations" on the navbar to go be directed to another page where you input your card information to make a donation.

**Light/Dark Mode**

On the homepage, click the sun icon to view the application in Dark mode. Then, click the moon icon to change it back to Light mode.

## Credits

Authors:

brooke-dunlap
BrandonDunlap
raulds-fmtx 
Innovative-J
Devinthedeveloper614


Started code provided by SMU.

## License

See the license provided by the repo.