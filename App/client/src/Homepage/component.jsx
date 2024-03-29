import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from "react"
import axios from 'axios'
import Slider from "@mui/material/Slider";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import WifiIcon from '@mui/icons-material/Wifi';
import WcIcon from '@mui/icons-material/Wc';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import BathroomIcon from '@mui/icons-material/Bathtub';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Menu } from '@mui/material';
import "./component.css"



function intersection(arr1, arr2) {
  const result = [];
  console.log(arr1)
  console.log(arr2)
  for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
          if (arr1[i]._id === arr2[j]._id) {
              result.push(arr1[i])
              break;
          }
      }
  }
  return result;
}

function calculateDistance(lat2, lon2) {
  // Convert latitude and longitude from degrees to radians
  const degToRad = Math.PI / 180;
  let lat1 = 34.068920 * degToRad;
  let lon1 = -118.445183 * degToRad;
  lat2 = lat2 * degToRad;
  lon2 = lon2 * degToRad;
  
  // Radius of the Earth in kilometers
  const R = 6371.0;
  
  // Compute the change in coordinates
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  
  // Apply the Haversine formula
  const a = Math.sin(dlat / 2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const distanceMiles = distance * 0.621371;
  
  return distanceMiles;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#dbc1ac', 0.75),
  '&:hover': {
    backgroundColor: alpha('#dbc1ac', 0.85),
  },
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cafeItem: {
     // Add margin to move the element down
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: 'none',
  },
  image: {
    width: '100%',
    height: '250px',
    borderRadius: theme.spacing(1),
    objectFit: 'cover', // Option 1: Crop the image
  },
  name: {
    fontSize: '1.2rem',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  rating: {
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: '#f44336', // Red color for rating
    margin: theme.spacing(1, 0),
  },
  icon : {
    margin: theme.spacing(1, 0),
    display: 'flex',
    alignItems: 'center', // Align items vertically
  }
}));

const RoundedToolbar = styled(Toolbar)(({ theme }) => ({
    marginTop: '10px',
    borderRadius: '5px',
    boxShadow: 'none',
    width: 'auto'
  }));

  const StyledFilterBar = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200], // Light gray background
    borderRadius: "10px",
    boxShadow: theme.shadows[2], // Shadow effect
    marginBottom: "10px", // Add some margin at the bottom
    width: "fit-content", // Adjust width to fit content
    padding: theme.spacing(2), // Padding within the toolbar
    display: "flex", // Use flexbox to align items
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    gap: theme.spacing(2), // Add spacing between elements
  }));
  
  const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    '& .MuiSvgIcon-root': {
      borderRadius: '50%',
      width: '1.2em',
      height: '1.2em',
    },
  }));

  const StyledSliderContainer = styled('div')({
    textAlign: 'center',
    marginTop: '10px', // Adjust margin-top as needed
  });

export function Header() {

    const [wifiChecked, setWifiChecked] = useState(false);
    const [restroomChecked, setRestroomChecked] = useState(false);
    const [quiet, setQuiet] = useState(false)
    const [searchResult, setSearchResult] = useState([])
    const [key,setKey] = useState("")
    const [price, setPrice] = useState(0)
    const [slideDistance, setSlideDistance] = useState(0.5)
    const [rating, setRating] = useState(0)
    const [numRatings, setNumRatings] = useState(0)
    const classes = useStyles();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let searchResultData = []
                if (!key.trim()) {
                    const all = await axios.get("http://localhost:3001/all");
                    searchResultData = all.data.data
                }
                if (key) {
                    const searchRes = await axios.get("http://localhost:3001/api/v1/name", { params: { key: key } });
                    console.log(searchRes);
                    searchResultData = searchRes.data.data;
                }

                if (rating != 0) {
                  searchResultData = searchResultData.filter(cafe => cafe.averageRating >= rating);

                  /*
                    const ratingRes = await axios.get("http://localhost:3001/ratings", { params: { num: rating } });
                    console.log(ratingRes);
                    const filterData = ratingRes.data.data;
                    // Perform intersection of searchResult and filter
                    searchResultData = intersection(searchResultData, filterData);
                    //setSearchResult(intersectedData);
                  */
                }

                if(numRatings != 0){
                  searchResultData = searchResultData.filter(cafe => cafe.numRatings >= numRatings);
                }

                if (slideDistance) {
                    for (let i = 0; i < searchResultData.length; i++) {
                        const lat1 = searchResultData[i].location.coordinates[0];
                        const lon1 = searchResultData[i].location.coordinates[1];
                        const distanceFrom = calculateDistance(lat1, lon1) 
                        console.log(distanceFrom)
                        if (distanceFrom > slideDistance) {
                            console.log("removed")
                            searchResultData.splice(i, 1)
                            i--;
                        }
                    } 
                }

                if (price != 0) {
                  searchResultData = searchResultData.filter(cafe => cafe.cost === price);
                   
                }

                if(restroomChecked){
                  searchResultData = searchResultData.filter(cafe => cafe.bathrooms === 'yes');
                }

                if(wifiChecked){
                  searchResultData = searchResultData.filter(cafe => cafe.wifi === 'yes');
                }

                if(quiet){
                  searchResultData = searchResultData.filter(cafe => cafe.noise === 'quiet');
                }

                setSearchResult(searchResultData)
                
                //console.log(searchResult)
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    }, [key, rating, numRatings, slideDistance, price, quiet, wifiChecked, restroomChecked]);
        /*console.log(filter)
        console.log(searchResult)
        const gt = searchResult.filter(element => filter.includes(element))
        console.log(gt)*/
        // To Do: only have the ones that are in both filter and searchresult be displayed

    const handlePriceChange = async (event) => {
      setPrice(event.target.value);

    };

    const handleNumRatingChange = async (event) => {
      setNumRatings(event.target.value)
    }

    const handleSlideChange = async (event) => {
      setSlideDistance(event.target.value);

    };
    
    const wifiChange = async (event) => {
      setWifiChecked(event.target.checked);

    };

    const restroomChange = async (event) => {
      setRestroomChecked(event.target.checked);

    };

    const quietChange = async (event) => {
      setQuiet(event.target.checked);
    }

    const handleRatingChange = async (event) => {
      setRating(event.target.value)
    }

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx= {{ backgroundColor: 'transparent', boxShadow: 'none', marginBottom: '10px'}}>
        <RoundedToolbar sx={{backgroundColor: '#4b3832'}}>
            <Link to="/profile">
            <Avatar></Avatar>
            </Link>
            <Link to="/recommend" style={{ display: 'flex', width: '100%', paddingLeft: '5vh', color: '#dbc1ac', textDecoration: 'none', fontFamily: 'Poppins, sans-serif', fontWeight: "bold"}}>
              Recommended
            </Link>
            <Typography
            variant="h6"
            component="div"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '35px',
              fontFamily: 'Poppins, sans-serif',
              marginRight: '500px',
              marginBottom: '0px',
              cursor: 'pointer', 
              color: '#efe9e2'
            }}
  >
    cafFIEND
  </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            {/* Search Bar */}
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={key}
              onChange= {(e) => setKey(e.target.value)}
            />
          </Search>
        </RoundedToolbar>
      </AppBar>
      </Box>


      <StyledFilterBar variant="outlined">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.6em', fontFamily: 'Poppins, sans-serif'}}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Price</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={price}
              label="Price"
              onChange={handlePriceChange}
              sx={{ minWidth: '70px', height: '30px', marginRight: '20px', fontFamily: 'Poppins, sans-serif'}}
            >
              {/* Change value of the prices to match the real distribution */}
              <MenuItem value={0}>Any</MenuItem>
              <MenuItem value={1}>$</MenuItem>
              <MenuItem value={2}>$$</MenuItem>
              <MenuItem value={3}>$$$</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.6em', fontFamily: 'Poppins, sans-serif'}}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Rating</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rating}
              label="Ratings"
              onChange={handleRatingChange}
              sx={{ minWidth: '70px', height: '30px', marginRight: '20px', fontFamily: 'Poppins, sans-serif'}}
            >
              {/* Change value of the prices to match the real distribution */}
              <MenuItem value={0}>1.0+</MenuItem>
              <MenuItem value={3}>3.0 +</MenuItem>
              <MenuItem value={3.5}>3.5 +</MenuItem>
              <MenuItem value={4}>4.0 +</MenuItem>
              <MenuItem value={4.5}>4.5 +</MenuItem>
            </Select>
          </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.6em', fontFamily: 'Poppins, sans-serif'}}>
          <FormControl>
            <InputLabel id="demo-simple-select-label"># Ratings</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={numRatings}
              label="# Ratings"
              onChange={handleNumRatingChange}
              sx={{ minWidth: '70px', height: '30px', marginRight: '20px', fontFamily: 'Poppins, sans-serif'}}
            >
              {/* Change value of the prices to match the real distribution */}
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={100}>100 +</MenuItem>
              <MenuItem value={300}>300 +</MenuItem>
              <MenuItem value={600}>600 +</MenuItem>
            </Select>
          </FormControl>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: '10px', marginRight: '20px', fontFamily: 'Poppins, sans-serif'}}>
            <Slider
              value={slideDistance}
              step={0.1}
              min={0.1}
              max={1.5}
              onChange={handleSlideChange}
              aria-labelledby="distance-slider"
              valueLabelDisplay="auto"
              sx = {{color: '#dbc1ac'}}
              //sx={{ height: 2}}
            />
          <Typography sx = {{marginTop: '-8px', fontFamily: 'Poppins, sans-serif'}}>Range: {slideDistance} mi</Typography>
          </Box>

          <Box sx ={{display: 'flex', alignItems: 'center', marginRight: '10px', fontFamily: 'Poppins, sans-serif'}}>
          <WifiIcon/>
          <StyledCheckbox
            checked={wifiChecked}
            onChange={wifiChange}
            color="primary"
          />
          </Box>

          <Box sx ={{display: 'flex', alignItems: 'center', marginRight: '10px', fontFamily: 'Poppins, sans-serif'}}>
          <WcIcon/>
          <StyledCheckbox
            checked={restroomChecked}
            onChange={restroomChange}
            color="primary"
          />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' , fontFamily: 'Poppins, sans-serif'}}>
          <VolumeOffIcon/>
            <StyledCheckbox
            checked={quiet}
            onChange={quietChange}
            //color="primary"
          />
          </Box>

        </Box>
      </StyledFilterBar>

{/* Cafe Grid */}
<div className={classes.root}>
<div className={classes.root}>
        <Grid container spacing={3}>
          {searchResult.map((cafe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link
                  to="/searchresult" 
                  onClick={() => {
                      // Store the name in local storage before navigating
                      localStorage.setItem('searchresult', cafe.name);
                      console.log(localStorage.getItem('searchresult'))
                  }}
              >
              <Paper elevation={3} className={classes.cafeItem}>
                <img className={classes.image} src={cafe.imgurl} alt={cafe.name} />
                <div style = {{fontSize: '1.4rem'}} className={classes.name}>{cafe.name}</div>
                <div style = {{fontFamily: 'Poppins, sans-serif', fontSize: '2vh'}} className={classes.averageRating}>Rating: {cafe.averageRating}</div>
                <div className= {classes.icon}>
                <div className = {classes.wifi}>{cafe.wifi === 'yes' && <WifiIcon style = {{marginRight: '5px'}}/>} </div>
                <div classname = {classes.bathroom}>{cafe.bathrooms === 'yes' && <WcIcon/>} </div>
                </div>
              </Paper>
              </Link> 
            </Grid> 
          ))}
        </Grid>
    </div>
      </div>
    </>
  );
}