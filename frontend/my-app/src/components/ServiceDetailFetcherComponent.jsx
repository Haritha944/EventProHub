import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ServiceDetailFetcherComponent = ({  servicerId, city,setServicesByServicer, setServicesByLocation }) => {
    
    useEffect(() => {
        const fetchServicesByServicer = async () => {
          if (servicerId) {
            try {
                const response = await axios.get(`${BASE_URL}services/relatedservicer/${servicerId}/`);
                console.log('Realted Servicer details:', response.data);
                setServicesByServicer(response.data);
            } catch (error) {
                console.error('Error fetching services by servicer:', error);
            }
          }
        };
      
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
      
        fetchServicesByServicer();
         fetchServicesByLocation();
      }, [servicerId, city, setServicesByServicer, setServicesByLocation]);
      
  return null;
}

export default ServiceDetailFetcherComponent