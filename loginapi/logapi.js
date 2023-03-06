const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool({
    
        host: "localhost",
        user: "postgres",
        port: 5432,
        password: "789456",
        database: "user"
      });

const app = express();

// Add middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Route for user registration
app.post('/register', async (req, res) => {
  const { first_name,last_name,mobile_no,email_id,user_id,password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (first_name,last_name,mobile_no,email_id,user_id,password) VALUES ($1, $2,$3,$4,$5,$6) RETURNING mobile_no', [first_name,last_name,mobile_no,email_id,user_id,password]);
    const userId = result.rows[0].mobile_no;
    res.status(201).json({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while registering the user' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1 AND password = $2', [user_id, password]);
    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    } else {
      const first_name = result.rows[0].first_name;
      
      const last_name = result.rows[0].last_name;
      const mobile_no = result.rows[0].mobile_no;

      const email_id = result.rows[0].email_id;
      res.status(200).json({ success: true, first_name,last_name,mobile_no ,email_id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while logging in' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
