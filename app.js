const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const express = require('express');
const app = express();

const dynamoDB = new DynamoDBClient({ region: 'eu-north-1'});
const tableName = 'Cars'

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome to the Car Workshop API!'});
});

app.get('/cars', async (req,res) => {
    try {
        const data = await dynamoDB.send(new ScanCommand({ TableName: tableName}));
        res.render('cars', { cars: data.Items });
    }catch {
        console.log('Error fetching cats:', error)
        res.status(500).send('Error fetching cars');
    }
});

app.post('/cars', async (req,res) => {
    try {
        const params = {
            TableName: tableName,
            Item:{
                registrationNumber: { S: req.body.registrationNumber },
                make: { S: req.body.make },
                model: { S: req.body.model },
                year: { N: req.body.year.toString() }
            }
        };
        await dynamoDB.send(new PutItemCommand(params));
        res.redirect('/cars');
    } catch (error) {
        console.log('Error adding car:', error);
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