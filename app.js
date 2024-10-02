const express = require('express')
const app = express();


const cars = [
    {registrationNumber: 'ABC123', make: 'Volvo', model: 'XC60', year: 2018},
    {registrationNumber: 'DEF456', make: 'Toyota', model: 'Corolla', year: 2020}
]


app.get('/', (req, res) => {
    res.send('Welcome to the Car Workshop API!');
});

app.get('/cars', (req,res) => {
    res.json(cars);
});

app.get('/cars/:registrationNumber', (req,res) => {
    const car = cars.find(c => c.registrationNumber === req.params.registrationNumber);

    if (car) {
    res.send(`Car found: ${car.make} ${car.model} from ${car.year}`)
    }else {
        res.status(404).send('Car not found')
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});