// fetchBooks.js

const axios = require('axios');

// Define the base URL of your server
const baseURL = 'http://localhost:5000';

// Function to fetch the list of books
const fetchBooks = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    console.log('Books available:', response.data);
  } catch (error) {
    console.error('Error fetching books:', error.message);
  }
};

// Call the function to fetch books
fetchBooks();
