const express = require('express');
const dotenv = require('dotenv');
const userRoute = require('./router/userRoute');
const friendRoute = require('./router/friendRoute'); 
dotenv.config();
const app = express();
const connectDB = require('./utils/dbconnection');
connectDB();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/users', userRoute);
app.use('/friends', friendRoute); 