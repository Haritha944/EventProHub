import React,{useState} from 'react'
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminEditSubscripModalComponent = ({ open, handleClose, subscription, onUpdate }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
   
    const [formData, setFormData] = useState({
        name: subscription.name,
        description: subscription.description,
        amount: subscription.amount,
        subscription_type: subscription.subscription_type,
        start_date: formatDate(subscription.start_date),
    })
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}payments/subscriptionedit/${subscription.id}/`, formData);
            onUpdate();  // Update the subscription list after edit
            handleClose();
        } catch (error) {
            console.error('Failed to update subscription', error);
        }
    };
  return (
    <Modal open={open} onClose={handleClose}>
    <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 1, boxShadow: 24 
    }}>
        <form onSubmit={handleSubmit}>
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
             <FormControl fullWidth margin="normal">
                        <InputLabel id="subscription-type-label">Subscription Type</InputLabel>
                        <Select
                            labelId="subscription-type-label"
                            id="subscription_type"
                            name="subscription_type"
                            value={formData.subscription_type}
                            onChange={handleChange}
                            label="Subscription Type"
                        >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                            <MenuItem value="Weekly">Weekly</MenuItem>
                        </Select>
                    </FormControl>
            <TextField
                label="Start Date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Save Changes
            </Button>
        </form>
    </Box>
</Modal>

  )
}

export default AdminEditSubscripModalComponent