require("dotenv").config();
const DBknex = require("./connection");

DBknex('user').insert({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890'
}).then(() => {
    console.log("User inserted successfully");
}).catch((error) => {
    console.error("Error inserting user:", error);
});
