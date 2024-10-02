const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/carworkshop')
.then(()=> console.log('Connected to MongoDB on port 27017'))
.catch(err => console.error('Connect error', err));

const Car = mongoose.model('Car', new mongoose.Schema({
    registrationNumber: String,
    make: String,
    model: String,
    year: Number
}));

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome to the Car Workshop API!'});
});

app.get('/cars', async (req,res) => {

    const cars = await Car.find();
    res.render('cars', { cars })
});

app.get('/cars/:registrationNumber', async (req,res) => {
    const car = await Car.findOne({ registrationNumber: req.params.registrationNumber });

    if (car) {
        res.render('carDetails', { car })
    }else {
        res.status(404).send('Car not found')
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});