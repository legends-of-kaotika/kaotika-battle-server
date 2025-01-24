const dotenv = require('dotenv'); 
dotenv.config();  // Load environment variables from .env file 
const apiKey = process.env.HELLO;  // Retrieve the environment variable 
console.log('Hello:', apiKey);  // Use the environment variable as needed