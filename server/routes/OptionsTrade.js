import express from 'express';
import { newOptionsTrade, getOptionsTrades, editOptionsTrade, deleteOptionsTrade } from '../controllers/OptionsTrade.js';

const router = express.Router()

router.post('/newOptionsTrade', newOptionsTrade);  
router.get('/optionTrades', getOptionsTrades) 
router.delete('/:id', deleteOptionsTrade)
router.patch('/:id', editOptionsTrade)              

export default router;