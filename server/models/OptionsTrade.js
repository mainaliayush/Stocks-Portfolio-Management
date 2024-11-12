import mongoose from 'mongoose';
import moment from 'moment'; // Import moment.js for date-time handling

const optionsTradeSchema = new mongoose.Schema({
    accountBalance: { type: Number },
    optionsTicker: { type: String, required: true },
    contractBuyPrice: { type: Number, required: true },
    contractSellPrice: { type: Number, required: true },
    selectOptionsType: { type: String, required: true },
    contractQuantity: { type: Number, required: true },
    optionsProfitLoss: { type: Number },
    optionsPercentProfitLoss: { type: Number },
    selectOptionsCategory: { type: String, required: true },
    selectOptionsPlatform: { type: String, required: true },
    strikePrice: { type: Number, required: true },
    daysTillExpiry: { type: Number, required: true },
    openInterest: { type: Number, required: true },
    volume: { type: Number, required: true },
    impliedVolatility: { type: Number, required: true },
    optionsDateBought: { type: Date, required: true },
    optionsDateSold: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return moment(value).isSameOrAfter(this.optionsDateBought);
            },
            message: 'Date sold must be later than or equal to date bought'
        }
    },
    optionsTradeNotes: { type: String, required: true },
});

const OptionsTrade = mongoose.model('OptionsTrade', optionsTradeSchema);
export default OptionsTrade;
