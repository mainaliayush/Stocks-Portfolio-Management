import StockTrade from "../models/StockTrade.js"

export const newStockTrade = async (req, res) => {
  try {
      let { accountBalance, ticker, buyPrice, sellPrice, quantity, selectCategory, selectPlatform, dateBought, dateSold, tradeNotes, imagePreviews, profitOrLoss, dayBought, daySold} = req.body;
      console.log("New trade added", req.body);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        // return `${year}-${month}-${day}`;
        return `${month}-${day}-${year}`;
      };

      dateBought = formatDate(dateBought);
      dateSold = formatDate(dateSold);

      const newStockTrade = new StockTrade({
        accountBalance,
        ticker,
        buyPrice,
        sellPrice,
        quantity,
        selectCategory,
        selectPlatform,
        dateBought,
        dateSold,
        tradeNotes,
        imagePreviews,
        profitOrLoss,
        dayBought,
        daySold,
      });

      console.log("New stock trade", newStockTrade);

      const savedTrade = await newStockTrade.save();
      const { _id } = savedTrade;

      res.status(200).json({ message: 'Stock trade added successfully.', _id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error occurred while adding stock trade.' });
    }
};


export const getStockTrades = async (req, res) => {
  try {
    const stockTrades = await StockTrade.find({});
    let stockTradeList = []
    for (let i = 0; i < stockTrades.length; i++) {
      var tempObj = {}
      tempObj["_id"] = stockTrades[i]["_id"]
      tempObj["accountBalance"] = stockTrades[i]["accountBalance"]
      tempObj["ticker"] = stockTrades[i]["ticker"]
      tempObj["buyPrice"] = stockTrades[i]["buyPrice"]
      tempObj["sellPrice"] = stockTrades[i]["sellPrice"]
      tempObj["quantity"] = stockTrades[i]["quantity"]
      tempObj["selectCategory"] = stockTrades[i]["selectCategory"]
      tempObj["selectPlatform"] = stockTrades[i]["selectPlatform"]
      tempObj["dateBought"] = stockTrades[i]["dateBought"]
      tempObj["dateSold"] = stockTrades[i]["dateSold"]
      tempObj["tradeNotes"] = stockTrades[i]["tradeNotes"]
      tempObj["imagePreviews"] = stockTrades[i]["imagePreviews"]
      tempObj["profitOrLoss"] = stockTrades[i]["profitOrLoss"]
      tempObj["dayBought"] = stockTrades[i]["dayBought"]
      tempObj["daySold"] = stockTrades[i]["daySold"]

      stockTradeList.push(tempObj)
    }
    res.status(200).json({ stockTrades: stockTradeList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in getting stock trading data' });
  }
};


export const deleteStockTrade = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID:", id);
    const tradeToDelete = await StockTrade.findById(id);
    
    if (!tradeToDelete) {
      return res.status(404).json({ message: "Trade not found!" });
    }
    
    await StockTrade.findByIdAndDelete(id);
    console.log("Trade deleted successfully!");
    return res.status(200).json({ message: 'Trade deleted successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete trade' });
  }
}


export const editStockTrade = async (req, res) => {
  try {
    let {ticker, buyPrice, sellPrice, quantity, selectCategory, selectPlatform, dateBought, dateSold, tradeNotes, imagePreviews, profitOrLoss, dayBought, daySold} = req.body;
    console.log("Req body: ", req.body)
    const { id } = req.params;
    console.log("ID in the backend is: ", id)

    const updatedStockTrade = await StockTrade.findByIdAndUpdate(id, {
      ticker,
      buyPrice,
      sellPrice,
      quantity,
      selectCategory,
      selectPlatform,
      dateBought,
      dateSold,
      tradeNotes,
      imagePreviews,
      profitOrLoss,
      dayBought,
      daySold,
    }, { new: true });

  res.status(200).json({ message: 'Stock Trade updated successfully.', data: updatedStockTrade});
  } catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error occurred while updating trade.' });
  }
};
