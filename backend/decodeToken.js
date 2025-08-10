const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkzZWE4MTQ5MjI4NDRmOGQzZGMyYzMiLCJpYXQiOjE3NTQ4MjYyODQsImV4cCI6MTc1NDkxMjY4NH0.Z9FW6qj9s4Hr0xiKwh5SQB7ZClX8kN0SiL1LMmizFD8';
const decoded = jwt.decode(token);

console.log(decoded);
