import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ServiceDetailFetcherComponent = ({  servicerId, city, setServicesByLocation }) => {
    
    useEffect(() => {
       
        const fetchServicesByLocation = async () => {
          if (city)  {
            try {
                const response = await axios.get(`${BASE_URL}services/relatedlocation/${city}/`);
                console.log('location details:', response.data);
                setServicesByLocation(response.data);
            } catch (error) {
                console.error('Error fetching services by location:', error);
            }
          }
        };
      
        
         fetchServicesByLocation();
      }, [servicerId, city, setServicesByLocation]);
      
  return null;
}

export default ServiceDetailFetcherComponent