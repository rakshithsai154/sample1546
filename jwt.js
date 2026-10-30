const express = require('express');
const fs = require('fs');
const bp = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 6003;
let stu = require('./students.json');

app.use(bp.urlencoded({ extended: true })); //Allows Express to understand form data and JSON sent in requests.
app.use(bp.json());

const SECRET_KEY = "mysecretkey"; // Use .env in real projects

// Generate JWT Token (Login Route)
app.post("/login", function (req, res) {
  const { username, password } = req.body;
  
  // Dummy authentication
  if (username === "admin" && password === "12345") {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// JWT Middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) {
        res.status(403).send("Invalid token");
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    res.status(403).send("Token missing");
  }
}

// Home
app.get("/", (req, res) => {
  res.send("<h3>JWT Protected Express REST API</h3>");
});

// Protected Routes
app.get("/list", verifyToken, (req, res) => {
  fs.readFile("students.json", function (err, data) {
    if (err) return res.status(500).send("Error reading file.");
    res.write(data);
    res.end();
  });
});

app.post("/", verifyToken, (req, res) => {
  const newstu = req.body;
  if (!newstu || !newstu.name || !newstu.roll) {
    return res.status(400).send("Invalid student data");
  }
  stu.push(newstu);
  mywrite(stu);
  res.send("Inserted");
});

app.put("/", verifyToken, (req, res) => {
  const upstu = req.body;
  let found = false;

  for (let s in stu) {
    if (stu[s]["roll"] == upstu["roll"]) {
      stu[s]["name"] = upstu["name"];
      found = true;
      break;
    }
  }

  if (found) {
    mywrite(stu);
    res.send("Updated successfully");
  } else {
    res.status(404).send("Student not found");
  }
});

app.delete("/", verifyToken, (req, res) => {
  const delstu = req.body;
  const initialLength = stu.length;

  stu = stu.filter(s => s && s.roll !== delstu["roll"]);

  if (stu.length < initialLength) {
    mywrite(stu);
    res.send("Deleted successfully");
  } else {
    res.status(404).send("Student not found");
  }
});

// Write to file
function mywrite(data) {
  fs.writeFile("students.json", JSON.stringify(data, null, 2), function (err) {
    if (err) console.error("Error writing file:", err);
  });
}

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});