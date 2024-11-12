import mongoose from 'mongoose';

const stockTradeSchema = new mongoose.Schema({
    accountBalance: {type: Number},
    ticker: { type: String, required: true },
    buyPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectCategory: { type: String, required: true },
    selectPlatform: { type: String, required: true },
    dateBought: { type: String, required: true },
    dateSold: { 
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value >= this.dateBought; 
            },
            message: 'Date sold must be later than or equal to date bought'
        }
    },
    tradeNotes: { type: String, required: false, maxlength: 500},
    imagePreviews: { type: [String], default: [] },
    profitOrLoss: { type: Number, required: true },
    dayBought: { type: String, required: true },
    daySold: { type: String, required: true },
});

const StockTrade = mongoose.model('StockTrade', stockTradeSchema);
export default StockTrade;
