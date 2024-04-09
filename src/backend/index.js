const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const csvParser = require('csv-parser');
app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
    res.send('Hello World!');

    console.log('Hello World!');
});

app.get('/', (req, res) => {
    const data = [];
    fs.createReadStream('../../public/ntsreports.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            res.json(data);
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).send('Internal Server Error');
        });
});


module.exports = app;

