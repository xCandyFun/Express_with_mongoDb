const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/carworkshop')
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.error('Connect error', err));

const Car = mongoose.model('Car', new mongoose.Schema({
    registrationNumber: String,
    make: String,
    model: String,
    year: Number
}));

const cars = [
    {registrationNumber: 'ABC123', make: 'Volvo', model: 'XC60', year: 2018},
    {registrationNumber: 'DEF456', make: 'Toyota', model: 'Corolla', year: 2020}
]


app.get('/', (req, res) => {
    res.send('Welcome to the Car Workshop API!');
});

app.get('/cars', async (req,res) => {

    const cars = await Car.find();
    res.json(cars);
});

app.get('/cars/:registrationNumber', async (req,res) => {
    const car = await Car.findOne({ registrationNumber: req.params.registrationNumber });

    if (car) {
    res.json(car)
    }else {
        res.status(404).send('Car not found')
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});