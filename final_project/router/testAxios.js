const axios = require('axios');

// Function to get the list of books using async/await
const getBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('Books List:', response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Function to get the list of books using Promises
const getBooksWithPromises = () => {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log('Books List:', response.data);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
};

// Call the functions
getBooks();
getBooksWithPromises();
