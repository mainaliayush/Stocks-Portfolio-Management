import express from 'express';
import { newStockTrade, editStockTrade, deleteStockTrade, getStockTrades } from '../controllers/StockTrade.js';

const router = express.Router()

router.post('/newStockTrade', newStockTrade);  
router.get('/stockTrades', getStockTrades) 
router.delete('/:id', deleteStockTrade)
router.patch('/:id', editStockTrade)               

export default router;