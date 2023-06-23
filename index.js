const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.POST || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12627924',
  password: 'NtbKpsI3Iw',
  database: 'sql12627924',
})

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.post('/login', (req, res) => {
  const { ids, password } = req.body;

  const query = `SELECT * FROM auth WHERE ids = ? AND password = ?`;
  db.query(query, [ids, password], (err, result) => {
    if (err) {
      console.error('Failed to execute MySQL query:', err);
      res.status(500).json({ error: 'Server error' });
    } else if (result.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});


app.post('/customer-data', (req, res) => {
  const { customer, orderDate, company, owner, quantity, item, weight, shipment, tracking, size, box, specification, checklist } = req.body;

  // Store customer data in MySQL 'customer' table
  const query = `INSERT INTO customers (customer, orderDate , company , owner , quantity ,item,weight,shipment,tracking,size,box,specification,checklist) VALUES (?, ? , ? , ? , ? , ? , ? , ? , ? ,? , ? , ? , ?)`;
  db.query(query, [customer, orderDate, company, owner, quantity, item, weight, shipment, tracking, size, box, specification, checklist], (err) => {
    if (err) {
      console.error('Failed to execute MySQL query:', err);
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ message: 'Submited' });
    }
  });
});



// Define a route to handle the request
app.get('/customers', (req, res) => {
  // Query to calculate the sum of quantity, weight, and box count for customer1
  const queryCustomer1 = 'SELECT SUM(quantity) AS totalQuantity, SUM(weight) AS totalWeight, SUM(box) AS totalBoxCount FROM customers WHERE customer = "customer1"';

  // Execute the query for customer1
  db.query(queryCustomer1, (err, resultCustomer1) => {
    if (err) throw err;

    // Access the sum of quantity, weight, and box count for customer1
    const totalQuantityCustomer1 = resultCustomer1[0].totalQuantity;
    const totalWeightCustomer1 = resultCustomer1[0].totalWeight;
    const totalBoxCountCustomer1 = resultCustomer1[0].totalBoxCount;

    // Query to calculate the sum of quantity, weight, and box count for customer2
    const queryCustomer2 = 'SELECT SUM(quantity) AS totalQuantity, SUM(weight) AS totalWeight, SUM(box) AS totalBoxCount FROM customers WHERE customer = "customer2"';

    // Execute the query for customer2
    db.query(queryCustomer2, (err, resultCustomer2) => {
      if (err) throw err;

      // Access the sum of quantity, weight, and box count for customer2
      const totalQuantityCustomer2 = resultCustomer2[0].totalQuantity;
      const totalWeightCustomer2 = resultCustomer2[0].totalWeight;
      const totalBoxCountCustomer2 = resultCustomer2[0].totalBoxCount;

      // Prepare the response object with all values
      const response = {
        customer1: {
          totalQuantity: totalQuantityCustomer1,
          totalWeight: totalWeightCustomer1,
          totalBoxCount: totalBoxCountCustomer1
        },
        customer2: {
          totalQuantity: totalQuantityCustomer2,
          totalWeight: totalWeightCustomer2,
          totalBoxCount: totalBoxCountCustomer2
        }
      };
      // Send the response to the frontend
      res.json(response);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
