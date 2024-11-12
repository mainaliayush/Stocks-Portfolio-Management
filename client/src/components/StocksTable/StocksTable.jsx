import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './stocksTable.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { format } from 'date-fns';
import dayjs from 'dayjs';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem, Select, Box, Grid, TextField, InputAdornment } from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';
import { utils as xlsxUtils, writeFile } from 'xlsx';

const StocksTable = () => {
    
    let initialBalance = 10000;
    const [accountBalance, setAccountBalance] = useState(initialBalance);
    const [ticker, setTicker] = useState('');
    const [buyPrice, setBuyPrice] = useState(0);
    const [sellPrice, setSellPrice] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [selectCategory, setSelectCategory] = useState('Select');
    const [selectPlatform, setSelectPlatform] = useState('Select');
    const [dateBought, setDateBought] = useState(null);
    const [dateSold, setDateSold] = useState(null);
    const [tradeNotes, setTradeNotes] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [transactions, setTransactions] = useState([]); 
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [stockTrades, setStockTrades] = useState([]);
    const [editTradeId, setEditTradeId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const addTrade = async () => {
        const buyPriceNum = parseFloat(buyPrice);
        const sellPriceNum = parseFloat(sellPrice);
        const quantityNum = parseInt(quantity);
    
        if (isNaN(buyPriceNum) || isNaN(sellPriceNum) || isNaN(quantityNum) || quantityNum <= 0) {
            console.error('Invalid input');
            return;
        }
    
        const pnl = (sellPriceNum - buyPriceNum) * quantityNum;
        const profitOrLoss = Number(pnl.toFixed(2));
        const newAccountBalance = accountBalance + profitOrLoss;
        
        setAccountBalance(newAccountBalance);
    
        const newTransaction = {
            ticker,
            buyPrice: buyPriceNum,
            sellPrice: sellPriceNum,
            quantity: quantityNum,
            selectCategory,
            selectPlatform,
            dateBought,
            dateSold,
            tradeNotes,
            imagePreviews,
            profitOrLoss: profitOrLoss,
            accountBalance: newAccountBalance,
            dayBought: new Date(dateBought).toLocaleDateString('en-US', { weekday: 'long' }),
            daySold: new Date(dateSold).toLocaleDateString('en-US', { weekday: 'long' })
        };
    
        try {
            let url = 'http://localhost:3001/stockTrade/newStockTrade';
            let method = 'post';
    
            if (editTradeId) {
                url = `http://localhost:3001/stockTrade/${editTradeId}`;
                method = 'patch';
            }
    
            const response = await axios[method](url, {
                ...newTransaction,
            });
    
            if (response.status !== 200) {
                throw new Error('Failed to add/edit trade');
            }
    
            setTransactions([newTransaction, ...transactions]);
            setTicker('');
            setBuyPrice('');
            setSellPrice('');
            setQuantity('');
            setSelectCategory('Select');
            setSelectPlatform('Select');
            setDateBought(null);
            setDateSold(null);
            setTradeNotes('');
            setImagePreviews([]);
            setIsPopupOpen(false);
            setEditTradeId(null);
    
            console.log("Trade added successfully");
            toast.success("Trade added successfully");
        } catch (error) {
            console.error('Error adding/editing trade:', error.message);
            toast.error("Failed to add trade");
        } finally {
            fetchStockTrades();
        }
    }; 

    const fetchStockTrades = async () => {
        try {
            const response = await axios.get("http://localhost:3001/stockTrade/stockTrades");
            console.log("Fetching data: ", response.data.stockTrades)
            const sortedStockTrades = response.data.stockTrades.sort((a, b) => new Date(b.dateBought) - new Date(a.dateBought));
            setStockTrades(sortedStockTrades);

            if(response.data.stockTrades.length > 0){
                console.log("Last account value: ", response.data.stockTrades[0].accountBalance)
            }else{
                console.log("No trades recorded!")
            }
            
            setAccountBalance(response.data.stockTrades[0].accountBalance);

        } catch (error) {
            console.error('Error fetching stock trades:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchStockTrades();
    }, [])

    useEffect(() => {
        if (!isPopupOpen) {
            // Reset form fields when modal is closed
            setTicker('');
            setBuyPrice('');
            setSellPrice('');
            setQuantity('');
            setSelectCategory('Select');
            setSelectPlatform('Select');
            setDateBought(null);
            setDateSold(null);
            setEditTradeId(null);
        }
    }, [isPopupOpen]);
         
    const handleEdit = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:3001/stockTrade/${id}`);
            console.log("Edit Response?", response)
            if (response.status !== 200) {
                throw new Error('Failed to fetch transaction for editing');
            }
            const transactionToEdit = await response.data.data;
            console.log("Response Data", response.data.data)
            
            setEditTradeId(id);
            setTicker(transactionToEdit.ticker);
            setBuyPrice(transactionToEdit.buyPrice.toString());
            setSellPrice(transactionToEdit.sellPrice.toString());
            setQuantity(transactionToEdit.quantity.toString());
            setSelectCategory(transactionToEdit.selectCategory);
            setSelectPlatform(transactionToEdit.selectPlatform);
            setDateBought(transactionToEdit.dateBought);
            setDateSold(transactionToEdit.dateSold);
            setTradeNotes(transactionToEdit.tradeNotes);
            setImagePreviews(transactionToEdit.imagePreviews);
            setIsPopupOpen(true);
        } catch(error) {
            console.error("Failed to edit trade:", error);
            toast.error("Failed to edit trade");
        }
    };

    const handleDelete = async (id) => {
        console.log("The delete ID is: ", id);
        try {
            const confirmed = window.confirm("Are you sure you want to delete this trade record?");
            if (!confirmed) {
                return; 
            }
    
            const response = await axios.delete(`http://localhost:3001/stockTrade/${id}`);
            console.log("Delete response", response.data);
            
            console.log("Stock trades before: ", stockTrades)
            // setStockTrades(stockTrades.filter((stockTrade)=> stockTrade.id !== id)); 
            setStockTrades(stockTrades => stockTrades.filter(stockTrade => stockTrade.id !== id)); 

            console.log("New list after deletion:", stockTrades)

            toast.success("Trade deleted successfully");
        } catch(error) {
            console.error("Failed to delete trade:", error);
            toast.error("Failed to delete trade");
        } finally {
            fetchStockTrades();
        }
    }; 

    const handleToggleForm = () => {
        setIsPopupOpen(!isPopupOpen);
    }
    
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const newPreviews = [];
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length) {
                        setImagePreviews([...imagePreviews, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        }
    };

    const handleAddImage = () => {
        document.getElementById('imageUpload').click();
    };

    const handleDeleteImage = (index) => {
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
    };
    
    const sortedData = [...stockTrades].sort((a, b) => {
        if (sortConfig.key !== null) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
    
    const requestSort = (key) => {
        let direction = 'asc'; 
      
        if (sortConfig.key === key) {
          if (sortConfig.direction === 'asc') {
            direction = 'desc'; 
          } else if (sortConfig.direction === 'desc') {
            direction = null; 
          }
        }
        setSortConfig({ key, direction });
    };
          
    const renderArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
        if (sortConfig.direction === 'asc') {
        return <StraightOutlinedIcon sx={{ transform: 'rotate(180deg)' }}/>;
        } else if (sortConfig.direction === 'desc') {
        return <StraightOutlinedIcon/>;
        }
    }
    return null;
    };

    const handleStockSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const convertToCSV = (data) => {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    }

    const convertToXLS = (data) => {
        const worksheet = xlsxUtils.json_to_sheet(data);
        const workbook = xlsxUtils.book_new();
        xlsxUtils.book_append_sheet(workbook, worksheet, 'Stock Trades');
        const excelBuffer = xlsxUtils.write(workbook, { bookType: 'xlsx', type: 'array' });
        return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    const downloadCSV = () => {
        const csvData = convertToCSV(tableData);
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvData);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'stock_trades.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const downloadXLS = () => {
        const xlsData = convertToXLS(tableData);
        const blob = new Blob([xlsData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'stock_trades.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const tableData = sortedData.filter((stockTrade) => {
        return (
            stockTrade.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stockTrade.selectCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||                                                                      
            stockTrade.selectPlatform.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
    });
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  
    const totalPages = Math.ceil(tableData.length / rowsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="table-container">
            <ToastContainer position="top-center" />
            <div className="table-top-buttons">
                <div className="buttons-div-one">
                    <Button className="add-trade" variant="outline-dark" size="lg" onClick={handleToggleForm} style={{fontSize:"20px"}}>
                        Add Trade 
                        <AddIcon sx={{ml:'5px', mb:'4px', fontSize:'25px'}}/>
                    </Button>
                    {/* <OptionsForm
                        show={isPopupOpen}
                        onHide={() => setIsPopupOpen(false)}
                    /> */}
                    <Modal
                    size="lg"
                    show={isPopupOpen}
                    onHide={() => setIsPopupOpen(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                            Stock Data
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Box className="input-group">
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
                                    <TextField style={{width: '20%'}} type="text" placeholder='Ticker' value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} />
                                    <TextField style={{width: '30%'}} type="text" placeholder='Buy Price' InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}} value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                                    <TextField style={{width: '30%'}} type="text" placeholder='Sell Price' InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}} value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                                    <TextField style={{width: '20%'}} type="number" placeholder='Qt.' min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1} mb={1} gap={1} flexWrap="nowrap" style={{overflowX: 'auto'}}>
                                    <Select style={{ width: '25%' }} labelId="stocks-multiple-name-label" placeholder="Category" id="stocks-multiple-category" value={selectCategory} onChange={(e) => { setSelectCategory(e.target.value) }}>
                                        <MenuItem disabled value="Select">Category</MenuItem>
                                        <MenuItem value="ETF">ETF</MenuItem>
                                        <MenuItem value="Tech">Tech</MenuItem>
                                        <MenuItem value="Semi">Semi</MenuItem>
                                        <MenuItem value="Consumer">Consumer</MenuItem>
                                        <MenuItem value="Fintech">Fintech</MenuItem>
                                        <MenuItem value="Energy">Energy</MenuItem>
                                        <MenuItem value="Health">Health</MenuItem>
                                        <MenuItem value="EV">EV</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    <Select style={{ width: '25%' }} labelId="stocks-multiple-platform-label" placeholder="Platform" id="stocks-multiple-platform" value={selectPlatform} onChange={(e) => { setSelectPlatform(e.target.value) }}>
                                        <MenuItem disabled value="Select">Platform</MenuItem>
                                        <MenuItem value="Robinhood">Robinhood</MenuItem>
                                        <MenuItem value="Webull">Webull</MenuItem>
                                        <MenuItem value="E-Trade">E-Trade</MenuItem>
                                        <MenuItem value="TD Ameritrade">TD Ameritrade</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker value={dateBought} onChange={(e) => setDateBought(e)}/>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker value={dateSold} onChange={(e) => setDateSold(e)}/>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Trade Notes" value={tradeNotes} onChange={(e)=>setTradeNotes(e.target.value)}/>
                                <Box display="flex" flexDirection="row" mt={1} mb={1} gap={1} flexWrap="nowrap" style={{overflowX: 'auto'}}>
                                    <Grid container spacing={1}>
                                        {imagePreviews.map((preview, index) => (
                                            <Grid item key={index}>
                                                <img
                                                    src={preview}
                                                    alt={`Image ${index + 1}`}
                                                    style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '5px'}}
                                                />
                                                <IconButton onClick={() => handleDeleteImage(index)} size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <TextField
                                        id="imageUpload"
                                        type="file"
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ accept: 'image/*', multiple: true }}
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <IconButton variant="contained" onClick={handleAddImage} style={{ width: '75px', height: '75px', borderRadius: "5px", border: '1px solid #c7c7c7'}} startIcon={<AddCircleOutlineIcon />}>
                                    + 
                                    </IconButton>
                                </Box>
                            </Box>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={addTrade} className="expo" variant="outline-dark" size="md" style={{width:"90px"}}>Add</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="buttons-div-two">
                <Paper
                component="form"
                className="stocks-searchbar"
                >
                    <SearchIcon />
                    <InputBase
                        sx={{ ml: 0.5 }}
                        placeholder="Search.."
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={searchQuery}
                        onChange={handleStockSearchChange}
                    />
                </Paper>
                    <Button className="add-filter" variant="outline-success" size="sm" style={{fontSize:"15px"}}>Filters <span><TuneIcon/></span> </Button>     
                    <Button className="export-csv" variant="outline-dark" size="sm" style={{fontSize:"12px"}} onClick={downloadCSV}>CSV <span><FileDownloadOutlinedIcon/></span> </Button>
                    <Button className="export-excel" variant="outline-dark" size="sm" style={{fontSize:"12px"}} onClick={downloadXLS}>XLS <span><FileDownloadOutlinedIcon/></span> </Button>
                </div>
            </div>
            <TableContainer component={Paper} className="TableContainer">
                <Table className="bordered-table">
                    <TableHead sx={{cursor:'pointer'}}>
                        <TableRow sx={{padding:'0px'}}>
                            <TableCell onClick={()=>requestSort('ticker')}><b>TICKER {renderArrow('ticker')}</b></TableCell>
                            <TableCell><b>BUY</b></TableCell>
                            <TableCell><b>SELL</b></TableCell>
                            <TableCell onClick={()=>requestSort('quantity')}><b>QNT {renderArrow('quantity')}</b></TableCell>
                            <TableCell onClick={()=>requestSort('dateBought')}><b>ENTRY {renderArrow('dateBought')}</b> </TableCell>
                            <TableCell onClick={()=>requestSort('dateSold')}><b>EXIT {renderArrow('dateSold')}</b></TableCell>
                            {/* <TableCell><b>BUY DAY</b></TableCell>
                            <TableCell><b>SELL DAY</b></TableCell> */}
                            <TableCell><b>CATEGORY</b></TableCell>
                            <TableCell><b>PLATFORM</b></TableCell>
                            <TableCell><b>NOTES</b></TableCell>
                            <TableCell onClick={()=>requestSort('profitOrLoss')}><b>PnL {renderArrow('profitOrLoss')}</b></TableCell>
                            <TableCell><b>ACTION</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {currentRows && currentRows.map((stockTrade) => (
                        <TableRow key={stockTrade._id}>
                            {/* <TableCell>{stockTrade._id}</TableCell> */}
                            <TableCell>{stockTrade.ticker}</TableCell>
                            <TableCell>${stockTrade.buyPrice.toFixed(2)}</TableCell>
                            <TableCell>${stockTrade.sellPrice.toFixed(2)}</TableCell>
                            <TableCell>{stockTrade.quantity}</TableCell>
                            <TableCell>{new Date(stockTrade.dateBought).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(stockTrade.dateSold).toLocaleDateString()}</TableCell>
                            {/* <TableCell>{stockTrade.dayBought}</TableCell>
                            <TableCell>{stockTrade.daySold}</TableCell> */}
                            <TableCell>{stockTrade.selectCategory}</TableCell>
                            <TableCell>{stockTrade.selectPlatform}</TableCell>
                            <TableCell>{stockTrade.tradeNotes}</TableCell>
                            <TableCell style={{ color: stockTrade.profitOrLoss >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                            {stockTrade.profitOrLoss >= 0 ? `$${stockTrade.profitOrLoss.toFixed(2)}` : `$${(-stockTrade.profitOrLoss).toFixed(2)}`}
                            </TableCell>
                            <TableCell>
                                <IconButton aria-label="edit" size="small">
                                    <EditIcon onClick={() => handleEdit(stockTrade._id)} />
                                </IconButton>
                                <IconButton aria-label="delete" size="small">
                                    <DeleteIcon onClick={() => handleDelete(stockTrade._id)} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination-controls">
                <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next 
                </button>
            </div>
        </div>
    );
}

export default StocksTable;