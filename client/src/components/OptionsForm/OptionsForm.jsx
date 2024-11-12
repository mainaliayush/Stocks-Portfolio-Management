// import React, {useState} from 'react'
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';

// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// const OptionsForm = (props, isPopupOpen, setIsPopupOpen) => {
//     const [ticker, setTicker] = useState('');
//     const [buyPrice, setBuyPrice] = useState('');
//     const [sellPrice, setSellPrice] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [dateBought, setDateBought] = useState('');
//     const [dateSold, setDateSold] = useState('');
//     const [editIndex, setEditIndex] = useState(-1);

//     const [profitOrLoss, setProfitOrLoss] = useState('');
//     const [transactions, setTransactions] = useState([]); 
    
//     const handleTickerChange = (event) => {
//         setTicker(event.target.value.toUpperCase())
//     }

//     const handleBuyPriceChange = (event) => {
//         setBuyPrice(event.target.value);
//     };

//     const handleSellPriceChange = (event) => {
//         setSellPrice(event.target.value);
//     };

//     const addTrade = () => {
//         const buyPriceNum = parseFloat(buyPrice);
//         const sellPriceNum = parseFloat(sellPrice);
//         const quantityNum = parseInt(quantity);
    
//         if (isNaN(buyPriceNum) || isNaN(sellPriceNum) || isNaN(quantityNum) || quantityNum <= 0) {
//             setProfitOrLoss('Invalid input');
//             return;
//         }
    
//         const difference = (sellPriceNum - buyPriceNum) * quantityNum;
//         setProfitOrLoss(difference.toFixed(2));
    
//         const newTransaction = {
//             ticker,
//             buyPrice: buyPriceNum,
//             sellPrice: sellPriceNum,
//             quantity: quantityNum,
//             dateBought,
//             dateSold,
//             profitOrLoss: difference.toFixed(2),
//             dayBought: new Date(dateBought).toLocaleDateString('en-US', { weekday: 'long' }),
//             daySold: new Date(dateSold).toLocaleDateString('en-US', { weekday: 'long' })
//         };
    
//         if (editIndex === -1) { // Add new transaction
//             setTransactions([...transactions, newTransaction]);
//         } else { // Edit existing transaction
//             const updatedTransactions = [...transactions];
//             updatedTransactions[editIndex] = newTransaction;
//             setTransactions(updatedTransactions);
//             setEditIndex(-1); // Reset editIndex after editing
//         }
    
//         setTicker('');
//         setBuyPrice('');
//         setSellPrice('');
//         setQuantity('');
//         setDateBought('');
//         setDateSold('');
//         setIsPopupOpen(false);
//     };

//     return (
//         <Modal
//           {...props}
//           size="lg"
//           aria-labelledby="contained-modal-title-vcenter"
//           centered
//         >
//           <Modal.Header closeButton>
//             <Modal.Title id="contained-modal-title-vcenter">
//               Options Data
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Box className="input-group">
//                 <TextField fullWidth type="text" placeholder='Ticker' value={ticker} onChange={handleTickerChange} />
//                 <TextField fullWidth type="text" placeholder='Buy Price' value={buyPrice} onChange={handleBuyPriceChange} />
//                 <TextField fullWidth type="text" placeholder='Sell Price' value={sellPrice} onChange={handleSellPriceChange} />
//                 <TextField fullWidth type="number" placeholder='Quantity' min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
//                 <TextField fullWidth type="date" placeholder='Date Bought' value={dateBought} onChange={(e) => setDateBought(e.target.value)} />
//                 <TextField fullWidth type="date" placeholder='Date Sold' value={dateSold} onChange={(e) => setDateSold(e.target.value)} />
//             </Box>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={addTrade} className="Add" variant="outline-dark" size="md">Add</Button>
//           </Modal.Footer>
//         </Modal>
//       );
//     };
    
// export default OptionsForm;