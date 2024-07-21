const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.static('ASSESSMENT 7 AND 8'));
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_info',
    password: 'Deepika@2004',
    port: 5432,
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/front.html");
});

pool.connect((err) => {
    if (err) {
        
        return console.error('Error acquiring client', err.stack);
    }

    pool.query('CREATE TABLE IF NOT EXISTS student_details(rollno INTEGER PRIMARY KEY, fname VARCHAR(30), lname VARCHAR(30), mobile VARCHAR(10), email VARCHAR(30), state VARCHAR(30))', (err, result) => {
        if (err) {
            return console.log("Error creating table student_details", err);
        }
        console.log("Table student_details created successfully")
    });
});

app.post('/insert', async (req, res) => {
    const { rollno, fname, lname, mobile, email, state } = req.body;
    try {
        await pool.query("INSERT INTO student_details(rollno, fname, lname, mobile, email, state) VALUES($1, $2, $3, $4, $5, $6)", [rollno, fname, lname, mobile, email, state]);
        res.send("Data inserted successfully");
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).send('Error inserting data');
    }
});

app.post('/delete', async (req, res) => {
    const { rollno } = req.body;
    try {
        await pool.query("DELETE FROM student_details WHERE rollno = $1", [rollno]);
        res.send("Data deleted successfully");
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).send('Error deleting data');
    }
});

app.post('/read', async (req, res) => {
    const { rollno } = req.body;
    try {
        const result = await pool.query("SELECT * FROM student_details WHERE rollno = $1", [rollno]);
        if (result.rows.length > 0) {
            const student = result.rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Student Details</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background: #f4f4f4;
                                margin: 0;
                                padding: 20px;
                            }
                            .container {
                                background: #fff;
                                padding: 20px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                max-width: 600px;
                                margin: auto;
                                border-radius: 8px;
                            }
                            h1 {
                                color: #333;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            th, td {
                                padding: 12px;
                                border: 1px solid #ddd;
                            }
                            th {
                                background: #4CAF50;
                                color: white;
                                text-align: left;
                            }
                            tr:nth-child(even) {
                                background: #f9f9f9;
                            }
                            .back-button {
                                display: inline-block;
                                margin-top: 20px;
                                padding: 10px 20px;
                                background: #4CAF50;
                                color: white;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Student Details</h1>
                            <table>
                                <tr>
                                    <th>Roll No</th>
                                    <td>${student.rollno}</td>
                                </tr>
                                <tr>
                                    <th>First Name</th>
                                    <td>${student.fname}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>${student.lname}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>${student.email}</td>
                                </tr>
                                <tr>
                                    <th>Mobile</th>
                                    <td>${student.mobile}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>${student.state}</td>
                                </tr>
                            </table>
                            <a class="back-button" href="/">Back</a>
                        </div>
                    </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                    <head>
                        <title>Student Details</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background: #f4f4f4;
                                margin: 0;
                                padding: 20px;
                            }
                            .container {
                                background: #fff;
                                padding: 20px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                max-width: 600px;
                                margin: auto;
                                border-radius: 8px;
                            }
                            h1 {
                                color: #333;
                            }
                            .back-button {
                                display: inline-block;
                                margin-top: 20px;
                                padding: 10px 20px;
                                background: #4CAF50;
                                color: white;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>No student found with roll number ${rollno}</h1>
                            <a class="back-button" href="/">Back</a>
                        </div>
                    </body>
                </html>
            `);
        }
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).send('Error reading data');
    }
});


app.post('/update', async (req, res) => {
    const { rollno, fname, lname, mobile, email, state } = req.body;
    try {
        await pool.query("UPDATE student_details SET fname = $1, lname = $2, mobile = $3, email = $4, state = $5 WHERE rollno = $6", [fname, lname, mobile, email, state, rollno]);
        res.send("Data updated successfully");
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).send('Error updating data');
    }
});

app.get('/report', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM student_details");
        res.send(`
            <html>
                <head>
                    <title>Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            background: #f4f4f4;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 10px;
                            border: 1px solid #ddd;
                        }
                        th {
                            background: #4CAF50;
                            color: white;
                        }
                        tr:nth-child(even) {
                            background: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h1>Student Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.rows.map(student => `
                                <tr>
                                    <td>${student.rollno}</td>
                                    <td>${student.fname}</td>
                                    <td>${student.lname}</td>
                                    <td>${student.email}</td>
                                    <td>${student.mobile}</td>
                                    <td>${student.state}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <button onclick="window.location.href='/'">Back</button>
                </body>
            </html>
        `);
    } catch (err) {
        console.log('Error generating report:', err);
        res.status(500).send('Failed to generate report');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
