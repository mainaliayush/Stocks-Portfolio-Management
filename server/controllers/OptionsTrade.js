import OptionsTrade from "../models/OptionsTrade.js"

export const newOptionsTrade = async (req, res) => {
    try {
        let { accountBalance, optionsTicker, selectOptionsType, contractBuyPrice, contractSellPrice, contractQuantity, optionsProfitLoss, optionsPercentProfitLoss, selectOptionsCategory, selectOptionsPlatform, strikePrice, daysTillExpiry, openInterest, volume, impliedVolatility, optionsDateBought, optionsDateSold, optionsTradeNotes } = req.body;

        console.log("New trade added", req.body);

        const newOptionsTrade = new OptionsTrade({
            accountBalance,
            optionsTicker,
            selectOptionsType,
            contractBuyPrice,
            contractSellPrice, 
            contractQuantity, 
            optionsProfitLoss,
            optionsPercentProfitLoss,
            selectOptionsCategory,
            selectOptionsPlatform,
            strikePrice,
            daysTillExpiry,
            openInterest,
            volume,
            impliedVolatility,
            optionsDateBought,
            optionsDateSold,
            optionsTradeNotes,     
        });

        const savedOptionsTrade = await newOptionsTrade.save();
        const { _id } = savedOptionsTrade;
        
        res.status(200).json({ message: 'Options Trade added successfully. Id: ', _id });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while adding Options Trade.' });
    }
};


export const getOptionsTrades = async (req, res) => {
    try {
        const optionsTrades = await OptionsTrade.find({});
        let optionsTradeList = []
        for (let i = 0; i < optionsTrades.length; i++) {
            var tempObj = {}
            tempObj["_id"] = optionsTrades[i]["_id"]
            tempObj["accountBalance"] = optionsTrades[i]["accountBalance"]
            tempObj["optionsTicker"] = optionsTrades[i]["optionsTicker"];
            tempObj["selectOptionsType"] = optionsTrades[i]["selectOptionsType"];
            tempObj["contractBuyPrice"] = optionsTrades[i]["contractBuyPrice"];
            tempObj["contractSellPrice"] = optionsTrades[i]["contractSellPrice"];
            tempObj["contractQuantity"] = optionsTrades[i]["contractQuantity"];
            tempObj["optionsProfitLoss"] = optionsTrades[i]["optionsProfitLoss"];
            tempObj["optionsPercentProfitLoss"] = optionsTrades[i]["optionsPercentProfitLoss"];
            tempObj["selectOptionsCategory"] = optionsTrades[i]["selectOptionsCategory"];
            tempObj["selectOptionsPlatform"] = optionsTrades[i]["selectOptionsPlatform"];
            tempObj["strikePrice"] = optionsTrades[i]["strikePrice"];
            tempObj["daysTillExpiry"] = optionsTrades[i]["daysTillExpiry"];
            tempObj["openInterest"] = optionsTrades[i]["openInterest"];
            tempObj["volume"] = optionsTrades[i]["volume"];
            tempObj["impliedVolatility"] = optionsTrades[i]["impliedVolatility"];
            tempObj["optionsDateBought"] = optionsTrades[i]["optionsDateBought"];
            tempObj["optionsDateSold"] = optionsTrades[i]["optionsDateSold"];
            tempObj["optionsTradeNotes"] = optionsTrades[i]["optionsTradeNotes"];

            optionsTradeList.push(tempObj)
        }
        res.status(200).json({ optionsTrades: optionsTradeList });

    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error in getting options trading data' });
    }
};


export const deleteOptionsTrade = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID:", id);
        const tradeToDelete = await OptionsTrade.findById(id);

        if (!tradeToDelete) {
            return res.status(404).json({ message: "Trade not found!" });
        }

        await OptionsTrade.findByIdAndDelete(id);
        console.log("Trade deleted successfully!");
        return res.status(200).json({ message: 'Trade deleted successfully!' });

    } catch (error){

    }
};


export const editOptionsTrade = async (req, res) => {
    try {
        let { optionsTicker, selectOptionsType, contractBuyPrice, contractSellPrice, contractQuantity, optionsProfitLoss, optionsPercentProfitLoss, selectOptionsCategory, selectOptionsPlatform, strikePrice, daysTillExpiry, openInterest, volume, impliedVolatility, optionsDateBought, optionsDateSold, optionsTradeNotes } = req.body;
        console.log("Req body: ", req.body)
        const { id } = req.params;

        console.log("ID in the backend is: ", id)

        const updatedOptionsTrade = await OptionsTrade.findByIdAndUpdate(id, {
            optionsTicker,
            selectOptionsType,
            contractBuyPrice,
            contractSellPrice, 
            contractQuantity, 
            optionsProfitLoss,
            optionsPercentProfitLoss,
            selectOptionsCategory,
            selectOptionsPlatform,
            strikePrice,
            daysTillExpiry,
            openInterest,
            volume,
            impliedVolatility,
            optionsDateBought,
            optionsDateSold,
            optionsTradeNotes, 
          }, { new: true });

        res.status(200).json({ message: 'Stock Trade updated successfully.', data: updatedOptionsTrade});
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while updating trade.' });
    }
};

