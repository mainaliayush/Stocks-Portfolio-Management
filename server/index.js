import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/User.js';
import stockTradeRoutes from './routes/StockTrade.js';
import optionsTradeRoutes from './routes/OptionsTrade.js';


const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Options Trading Tracker!');
});

app.use('/user', userRoutes )
app.use('/optionsTrade', optionsTradeRoutes)
app.use('/stockTrade', stockTradeRoutes )


const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGODB_URI, {
}).then(() => {
  app.listen(PORT, () => console.log(`Server listening to port: http://localhost:${PORT}/`));
})
.catch((error) => console.log(`${error} did not connect`));


