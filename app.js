const express = require('express');
const AWS = require('aws-sdk');
const app = express();

AWS.config.update({
    region: 'eu-north-1'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'CarWorkshop'

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome to the Car Workshop API!'});
});

app.get('/cars', async (req,res) => {
    try {
        const { Item: cars } = await dynamoDB.scan({ TableName: tableName }).promise();
        res.render('cars', { cars });
    }catch {
        res.status(500).send('Error fetching cars');
    }
});

app.post('/cars', async (req,res) => {
    try {
        await dynamoDB.put({
            TableName: tableName,
            Item: { ...req.body, year: + req.body.year }
        }).promise();
        res.redirect('/cars');
    } catch{
        res.status(500).send('Error adding car');
    }
});

app.get('/cars/:registrationNumber', async (req,res) => {
    try {
        const { Item: car } = await dynamoDB.get({ TableName: tableName, Key: { registrationNumber } }).promise();
        car ? res.render('carDetails', {car}) : res.status(404).send('Car not found');
    } catch {
        res.status(500).send('Error fetching car');
    }
    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});