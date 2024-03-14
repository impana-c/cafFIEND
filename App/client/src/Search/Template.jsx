import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import BathroomIcon from '@mui/icons-material/Wc';
import WifiIcon from '@mui/icons-material/Wifi';
import NoiseAwareIcon from '@mui/icons-material/VolumeUp';
import StudyIcon from '@mui/icons-material/School';
import './Template.css';
import ReviewForm from '../Ratings/ReviewForm';
import Paper from '@material-ui/core/Paper';

const libraries = ['places'];

function Template() {
  const [shop, setShop] = useState(null);
  const [user, setUser] = useState(null);
  const userSession = localStorage.getItem('token');

  useEffect(() => {
    const getInfo = async () => {
      const shopName = localStorage.getItem('searchresult');
      if (shopName) {
        try {
          const response = await axios.get('http://localhost:3001/searchresult', { params: { name: shopName } });
          setShop(response.data.shop);
          if (userSession) {
            const response2 = await axios.get('http://localhost:3001/profile', { params: { token: userSession } });
            setUser(response2.data.user);
          }
        } catch (error) {
          console.error('Error fetching shop:', error);
        }
      }
    };

    getInfo();
  }, [userSession]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY', //CHANGE to your own API key
    libraries,
  });

  if (loadError) return <Typography variant="h6">Error loading maps</Typography>;
  if (!isLoaded) return <CircularProgress />;

  const center = shop && shop.location.coordinates ? {
    lat: shop.location.coordinates[0],
    lng: shop.location.coordinates[1]
  } : null;

  return (
    <div className="template-container" style = {{marginTop: '-5px'}}>
      <Typography variant="h3" component="h1" className=".template-header">
        {shop ? shop.name : 'Shop Details'}
      </Typography>

      {shop && center ? (
        <>
          <Paper className="common-section-style section">
            <img className = "image" src={shop.imgurl} alt="Shop Image"/>
            <Typography component="p">Location: {shop.location.address}</Typography>
            <Typography component="p">Average rating: {shop.averageRating}</Typography>
            <Typography component="p">Cost: {'$'.repeat(shop.cost)}</Typography>
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%' }}
              zoom={17}
              center={center}
            >
              <MarkerF position={center} />
            </GoogleMap>
          </Paper>

          <Box className="common-section-style features">
              <Typography variant="h6">Features</Typography>
              <ul className="feature-list"> {/* Removed the dot before feature-list */}
                <li><BathroomIcon /> Bathrooms: {shop.bathrooms}</li>
                <li><WifiIcon /> Wifi: {shop.wifi}</li>
                <li><NoiseAwareIcon /> Noise: {shop.noise}</li>
                <li><StudyIcon /> Studyability: {shop.studyability}</li>
              </ul>
          </Box>
          <ReviewForm />
          <Button
            size="small"
            variant="contained"
            component={Link}
            to="/home"
            sx={{
              backgroundColor: '#423629',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#30261d'
              },
              marginTop: '2px',
            }}
          >
            Back to Home
          </Button>
        </>
      ) : (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}

      <Typography
        variant="caption"
        className="footer-note"
        sx={{
          marginTop: '20px', 
          display: 'block', 
          textAlign: 'center', 
        }}
      >
        Note: much of the data on this page was taken from 'yelp.com'.
      </Typography>
    </div>
  );
}

export default Template;
