import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './optionsTable.css';

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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';

const OptionsTable = () => {

    let initialBalance = 10000;
    const [accountBalance, setAccountBalance] = useState(initialBalance);
    const [optionsTicker, setOptionsTicker] = useState('');
    const [selectOptionsType, setSelectOptionsType] = useState('Options Type')
    const [contractBuyPrice, setContractBuyPrice] = useState('');
    const [contractSellPrice, setContractSellPrice] = useState('');
    const [contractQuantity, setContractQuantity] = useState('');
    const [optionsProfitLoss, setOptionsProfitLoss] = useState('');
    const [optionsPercentProfitLoss, setOptionsPercentProfitLoss] = useState('');
    const [optionsDateBought, setOptionsDateBought] = useState(null);
    const [optionsDateSold, setOptionsDateSold] = useState(null);
    const [strikePrice, setStrikePrice] = useState('');
    const [daysTillExpiry, setDaysTillExpiry] = useState('');
    const [openInterest, setOpenInterest] = useState('');
    const [volume, setVolume] = useState('');
    const [impliedVolatility, setImpliedVolatility] = useState('');
    const [selectOptionsCategory, setSelectOptionsCategory] = useState('Select Category')
    const [selectOptionsPlatform, setSelectOptionsPlatform] = useState('Select Platform')
    const [optionsTradeNotes, setOptionsTradeNotes] = useState('')

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [optionsTransactions, setOptionsTransactions] = useState([]); 
    const [optionsTrades, setOptionsTrades] = useState([]); 
    const [editTradeId, setEditTradeId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const addTrade = async () => {
        const contractBuyPriceNum = parseFloat(contractBuyPrice);
        const contractSellPriceNum = parseFloat(contractSellPrice);
        const contractQtNum = parseInt(contractQuantity);
        
        if (isNaN(contractBuyPriceNum) || isNaN(contractSellPriceNum) || isNaN(contractQtNum) || contractQtNum <= 0) {
            console.error('Invalid input');
            return;
        }

        const optionsProfitLoss = Number(((contractSellPriceNum - contractBuyPriceNum) * contractQtNum).toFixed(2));
        const originalInvestment = Number(contractBuyPriceNum * contractQtNum);
        const optionsPercentProfitLoss = ((optionsProfitLoss / originalInvestment) * 100).toFixed(2);
        const newAccountBalance = accountBalance + parseFloat(optionsProfitLoss);;
        
        setAccountBalance(newAccountBalance);
        
        const newOptionsTransaction = {
            optionsTicker,
            selectOptionsType,
            contractBuyPrice:contractBuyPriceNum, 
            contractSellPrice:contractSellPriceNum,
            contractQuantity:contractQtNum,
            optionsProfitLoss,
            optionsPercentProfitLoss,
            accountBalance: newAccountBalance,
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
        };

        try {
            let url = 'http://localhost:3001/optionsTrade/newOptionsTrade';
            let method = 'post';

            if (editTradeId) {
                url = `http://localhost:3001/optionsTrade/${editTradeId}`;
                method = 'patch';
            }
            
            const response = await axios[method](url, {
                ...newOptionsTransaction,
            });

            if (response.status !== 200) {
                throw new Error('Failed to add/edit trade');
            }
            
            setOptionsTransactions([ newOptionsTransaction, ...optionsTransactions ])
            setOptionsTicker('');
            setSelectOptionsType('Options Type');
            setContractBuyPrice('');
            setContractSellPrice('');
            setContractQuantity('');
            setOptionsProfitLoss('');
            setOptionsPercentProfitLoss('');
            setSelectOptionsCategory('Select Category');
            setSelectOptionsPlatform('Select Platform');
            setStrikePrice('');
            setDaysTillExpiry('');
            setOpenInterest('');
            setVolume('');
            setImpliedVolatility('');
            setOptionsDateBought(null);  
            setOptionsDateSold(null);
            setOptionsTradeNotes('');
            setIsPopupOpen(false);
            setEditTradeId(null); 

            console.log("Trade added successfully");
            toast.success("New trade added successfully!");
        } catch (error){
            console.error('Error adding/editing trade:', error.message);
            toast.error("Failed to add trade");
        } finally {
            fetchOptionsTrades();
        }
    }

    const fetchOptionsTrades = async() => {
        try {
            const response = await axios.get("http://localhost:3001/optionsTrade/optionTrades")
            console.log("Fetching data: ", response.data.optionsTrades)
            const sortedOptionsTrades = response.data.optionsTrades.sort((a, b) => new Date(b.optionsDateSold) - new Date(a.optionsDateSold));
            setOptionsTrades(sortedOptionsTrades);

            if(response.data.optionsTrades.length > 0){
                console.log("Last account value: ", response.data.optionsTrades[0].accountBalance)
            }else{
                console.log("No trades recorded!")
            }
            setAccountBalance(response.data.optionsTrades[0].accountBalance);

        } catch (error){
            console.error('Error fetching options trades:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchOptionsTrades();
    }, [])

    useEffect(() => {
        if (!isPopupOpen) {
            // Reset form fields when modal is closed
            setOptionsTicker('');
            setSelectOptionsType('Options Type');
            setContractBuyPrice('');
            setContractSellPrice('');
            setContractQuantity('');
            setOptionsProfitLoss('');
            setOptionsPercentProfitLoss('');
            setSelectOptionsCategory('Select Category');
            setSelectOptionsPlatform('Select Platform');
            setStrikePrice('');
            setDaysTillExpiry('');
            setOpenInterest('');
            setVolume('');
            setImpliedVolatility('');
            setOptionsDateBought(null);  
            setOptionsDateSold(null);
            setOptionsTradeNotes('');
            setEditTradeId(null);
        }
    }, [isPopupOpen]);

    const handleEdit = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:3001/optionsTrade/${id}`);
            console.log("Edit Response?", response)
            if (response.status !== 200) {
                throw new Error('Failed to fetch transaction for editing');
            }
            const transactionToEdit = await response.data.data;
            console.log("Response Data", response.data.data)
            
            setEditTradeId(id);
            setOptionsTicker(transactionToEdit.optionsTicker);
            setSelectOptionsType(transactionToEdit.selectOptionsType);
            setContractBuyPrice(transactionToEdit.contractBuyPrice.toString());
            setContractSellPrice(transactionToEdit.contractSellPrice.toString());
            setContractQuantity(transactionToEdit.contractQuantity.toString());
            setOptionsProfitLoss(transactionToEdit.optionsProfitLoss);
            setOptionsPercentProfitLoss(transactionToEdit.optionsPercentProfitLoss);
            setSelectOptionsCategory(transactionToEdit.selectOptionsCategory);
            setSelectOptionsPlatform(transactionToEdit.selectOptionsPlatform);
            setStrikePrice(transactionToEdit.strikePrice);
            setDaysTillExpiry(transactionToEdit.daysTillExpiry);
            setOpenInterest(transactionToEdit.openInterest);
            setVolume(transactionToEdit.volume);
            setImpliedVolatility(transactionToEdit.impliedVolatility);
            setOptionsDateBought(transactionToEdit.optionsDateBought);
            setOptionsDateSold(transactionToEdit.optionsDateSold);
            setOptionsTradeNotes(transactionToEdit.optionsTradeNotes);
            // setImagePreviews(transactionToEdit.imagePreviews);
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
    
            const response = await axios.delete(`http://localhost:3001/optionsTrade/${id}`);
            console.log("Delete response", response.data);
            
            console.log("Stock trades before: ", optionsTrades)
            // setStockTrades(stockTrades.filter((stockTrade)=> stockTrade.id !== id)); 
            setOptionsTrades(optionsTrades => optionsTrades.filter(optionsTrade => optionsTrade.id !== id)); 

            console.log("New list after deletion:", optionsTrades)

            toast.success("Trade deleted successfully");
        } catch(error) {
            console.error("Failed to delete trade:", error);
            toast.error("Failed to delete trade");
        } finally {
            fetchOptionsTrades();
        }
    }; 
    
    const handleToggleForm = () => {
        setIsPopupOpen(!isPopupOpen);
    }

    const handleImageUpload = (e) => {
        // const files = e.target.files;
        // if (files) {
        //     const newPreviews = [];
        //     for (let i = 0; i < files.length; i++) {
        //         const reader = new FileReader();
        //         reader.onload = () => {
        //             newPreviews.push(reader.result);
        //             if (newPreviews.length === files.length) {
        //                 setImagePreviews([...imagePreviews, ...newPreviews]);
        //             }
        //         };
        //         reader.readAsDataURL(files[i]);
        //     }
        // }
    };

    const handleAddImage = () => {
        // document.getElementById('imageUpload').click()
    };

    const handleDeleteImage = (index) => {
        // const updatedPreviews = [...imagePreviews];
        // updatedPreviews.splice(index, 1);
        // setImagePreviews(updatedPreviews);
    };

    const shouldDisableDate = (date) => {
        const day = date.day();
        const today = dayjs();
        // Disable Saturdays and Sundays
        return day === 0 || day === 6 || date.isAfter(today, 'day'); 
    };

    const sortedData = [...optionsTrades].sort((a, b) => {
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

    const handleOptionsSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const tableData = sortedData.filter((optionsTrade) => {
        return (
            optionsTrade.optionsTicker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            optionsTrade.selectOptionsCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
            optionsTrade.selectOptionsPlatform.toLowerCase().includes(searchQuery.toLowerCase()) 
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
            <div className="table-top-buttons">
                <div className="buttons-div-one">
                    <ToastContainer position="top-center" />
                    <Button className="add-trade" variant="outline-dark" size="lg" onClick={handleToggleForm} style={{fontSize:"20px"}}>
                        Add Trade 
                        <AddIcon sx={{ml:'5px', mb:'4px', fontSize:'25px'}}/>
                    </Button>
                    <Modal
                    size="lg"
                    show={isPopupOpen}
                    onHide={() => setIsPopupOpen(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Options Data
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Box className="input-group">
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
                                    <TextField style={{width: '25%'}} type="text" placeholder='Ticker' value={optionsTicker} onChange={(e) => setOptionsTicker(e.target.value.toUpperCase())} />
                                    <TextField style={{width: '30%'}} type="text" placeholder=' Buy Price' value={contractBuyPrice} InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}}  onChange={(e) => setContractBuyPrice(e.target.value)} />
                                    <TextField style={{width: '30%'}} type="text" placeholder=' Sell Price' value={contractSellPrice} InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}} onChange={(e) => setContractSellPrice(e.target.value)} />
                                    <TextField style={{width: '15%'}} type="number" placeholder='Qt.' min="0" value={contractQuantity} onChange={(e) => setContractQuantity(e.target.value)} />
                                    <Select style={{ width: '30%' }} labelId="options-type-label" placeholder="Type" id="options-type" value={selectOptionsType} onChange={(e) => { setSelectOptionsType(e.target.value) }}>
                                        <MenuItem disabled value="Options Type">Options Type</MenuItem>
                                        <MenuItem value="Calls">Calls</MenuItem>
                                        <MenuItem value="Puts">Puts</MenuItem>
                                    </Select>

                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1} mb={1} gap={1} flexWrap="nowrap" style={{overflowX: 'auto'}}>
                                    <TextField style={{width: '20%'}} type="number" placeholder='Strike' value={strikePrice} onChange={(e) => setStrikePrice(e.target.value.toUpperCase())} InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}} />
                                    <TextField style={{width: '20%'}} type="number" placeholder='DTE' value={daysTillExpiry} onChange={(e) => setDaysTillExpiry(e.target.value)} />
                                    <TextField style={{width: '20%'}} type="number" placeholder='OI' value={openInterest} onChange={(e) => setOpenInterest(e.target.value)} />
                                    <TextField style={{width: '20%'}} type="number" placeholder='Vol' min="0" value={volume} onChange={(e) => setVolume(e.target.value)} />
                                    <TextField style={{width: '15%'}} type="number" placeholder='IV' min="0" value={impliedVolatility} onChange={(e) => setImpliedVolatility(e.target.value)} />
                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={1} gap={1} flexWrap="nowrap" style={{overflowX: 'auto'}}>
                                    <Select style={{ width: '12%' }} labelId="stocks-multiple-name-label" placeholder="Category" id="stocks-multiple-category" value={selectOptionsCategory} onChange={(e) => { setSelectOptionsCategory(e.target.value) }}>
                                        <MenuItem disabled value="Select Category">Category</MenuItem>
                                        <MenuItem value="ETF">ETF</MenuItem>
                                        <MenuItem value="Tech">Tech</MenuItem>
                                        <MenuItem value="Semi">Semi</MenuItem>
                                        <MenuItem value="Consumer">Consumer</MenuItem>
                                        <MenuItem value="Fintech">Fintech</MenuItem>
                                        <MenuItem value="Energy">Energy</MenuItem>
                                        <MenuItem value="EV">EV</MenuItem>
                                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    <Select style={{ width: '12%' }} labelId="stocks-multiple-platform-label" placeholder="Platform" id="stocks-multiple-platform" value={selectOptionsPlatform} onChange={(e) => { setSelectOptionsPlatform(e.target.value) }}>
                                        <MenuItem disabled value="Select Platform">Platform</MenuItem>
                                        <MenuItem value="Robinhood">Robinhood</MenuItem>
                                        <MenuItem value="Webull">Webull</MenuItem>
                                        <MenuItem value="E-Trade">E-Trade</MenuItem>
                                        <MenuItem value="TD Ameritrade">TD Ameritrade</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker value={optionsDateBought} onChange={(e) => setOptionsDateBought(e)} shouldDisableDate={shouldDisableDate}/>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker value={optionsDateSold} onChange={(e) => setOptionsDateSold(e)} shouldDisableDate={shouldDisableDate} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                <TextField fullWidth multiline rows={3} variant="outlined" placeholder="Trade Notes" value={optionsTradeNotes} onChange={(e)=>setOptionsTradeNotes(e.target.value)}/>
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
                className="options-searchbar"
                >
                    <SearchIcon />
                    <InputBase
                        sx={{ ml: 0.5 }}
                        placeholder="Search.."
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={searchQuery}
                        onChange={handleOptionsSearchChange}
                    />
                </Paper>
                    <Button className="add-filter" variant="outline-success" size="sm" style={{fontSize:"15px"}}>Filters <span><TuneIcon/></span> </Button>     
                    <Button className="export-csv" variant="outline-dark" size="sm" style={{fontSize:"12px"}}>CSV <span><FileDownloadOutlinedIcon/></span> </Button>
                    <Button className="export-excel" variant="outline-dark" size="sm" style={{fontSize:"12px"}}>XLS <span><FileDownloadOutlinedIcon/></span> </Button>
                </div>
            </div>
            <TableContainer component={Paper} className="TableContainer">
                <Table className="bordered-table">
                    <TableHead sx={{cursor:'pointer'}}>
                        <TableRow sx={{padding:'0px'}}>
                            <TableCell onClick={()=>requestSort('optionsTicker')}><b>TICKER {renderArrow('optionsTicker')}</b></TableCell>
                            <TableCell><b>TYPE</b></TableCell>
                            <TableCell><b>$BUY</b></TableCell>
                            <TableCell><b>$SELL</b></TableCell>
                            <TableCell onClick={()=>requestSort('contractQuantity')}><b>QNT {renderArrow('contractQuantity')}</b></TableCell>
                            <TableCell><b>CATEGORY</b></TableCell>
                            {/* <TableCell><b>PLATFORM</b></TableCell> */}
                            <TableCell><b>STRIKE$</b></TableCell>
                            <TableCell onClick={()=>requestSort('daysTillExpiry')}><b>DTE {renderArrow('daysTillExpiry')}</b></TableCell>
                            {/* <TableCell><b>OI</b></TableCell> */}
                            {/* <TableCell><b>VOL</b></TableCell> */}
                            {/* <TableCell><b>IV</b></TableCell> */}
                            <TableCell onClick={()=>requestSort('optionsDateBought')}><b>OPEN TIME {renderArrow('optionsDateBought')}</b></TableCell>
                            <TableCell onClick={()=>requestSort('optionsDateSold')}><b>CLOSE TIME {renderArrow('optionsDateSold')}</b></TableCell>
                            {/* <TableCell><b>NOTES</b></TableCell> */}
                            <TableCell onClick={()=>requestSort('optionsPercentProfitLoss')}><b>% PNL {renderArrow('optionsPercentProfitLoss')}</b></TableCell>
                            <TableCell onClick={()=>requestSort('optionsProfitLoss')}><b>PNL {renderArrow('optionsProfitLoss')}</b></TableCell>
                            <TableCell><b>ACTION</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRows && currentRows.map((optionsTrades) => 
                            <TableRow key={optionsTrades._id}>
                                <TableCell >{optionsTrades.optionsTicker}</TableCell>
                                <TableCell>{optionsTrades.selectOptionsType}</TableCell>
                                <TableCell>{optionsTrades.contractBuyPrice}</TableCell>
                                <TableCell>{optionsTrades.contractSellPrice}</TableCell>
                                <TableCell>{optionsTrades.contractQuantity}</TableCell>
                                {/* <TableCell>{optionsTrades.optionsProfitLoss}</TableCell> */}
                                <TableCell>{optionsTrades.selectOptionsCategory}</TableCell>
                                {/* <TableCell>{optionsTrades.selectOptionsPlatform}</TableCell> */}
                                <TableCell>$ {optionsTrades.strikePrice}</TableCell>
                                <TableCell>{optionsTrades.daysTillExpiry} {optionsTrades.daysTillExpiry > 1 ? 'days': 'day'} </TableCell>
                                {/* <TableCell>{optionsTrades.openInterest}</TableCell> */}
                                {/* <TableCell>{optionsTrades.volume}</TableCell> */}
                                {/* <TableCell>{optionsTrades.impliedVolatility}</TableCell> */}
                                <TableCell>{format(new Date(optionsTrades.optionsDateBought), 'MM/dd/yy HH:mm')}</TableCell>
                                <TableCell>{format(new Date(optionsTrades.optionsDateSold), 'MM/dd/yy HH:mm')}</TableCell>
                                {/* <TableCell>{optionsTrades.optionsTradeNotes}</TableCell> */}
                                <TableCell>{optionsTrades.optionsPercentProfitLoss.toFixed(2)} %</TableCell>
                                <TableCell style={{ color: optionsTrades.optionsProfitLoss >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {optionsTrades.optionsProfitLoss >= 0 ? `$${optionsTrades.optionsProfitLoss.toFixed(2)}` : `$${(-optionsTrades.optionsProfitLoss).toFixed(2)}`}
                                </TableCell>
                                <TableCell sx={{minWidth:'35px'}}>
                                    <IconButton aria-label="edit" size="small">
                                        <EditIcon onClick={() => handleEdit(optionsTrades._id)} />
                                    </IconButton>
                                    <IconButton aria-label="delete" size="small">
                                        <DeleteIcon onClick={() => handleDelete(optionsTrades._id)} />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination-controls">
                <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>
                    {currentPage} of {totalPages}
                </span>
                <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next 
                </button>
            </div>
        </div>
    );
}

export default OptionsTable;