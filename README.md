# 35lproject (REPLACE WITH NAME)

### Cloning
```
git clone https://github.com/impana-c/35lproject
cd 35lproject
```

### Installing dependencies for the client
```
cd App/client
npm install
npm i express cors mongoose dotenv nodemon concurrently 
npm install react-icons bootstrap axios react-router-dom 
npm install @react-google-maps/api
```

### Installing dependencies for the server
```
cd ../server
npm init -y
npm install express mongoose cors nodemon
```

### Installing UI dependencies
```
cd ../client
npm install @mui/icons-material f
cd ..
npm install @mui/material @mui/styled-engine-sc styled-components f
```

### Starting the app (after all installations)
(Make sure to run: 
    `sudo killall -9 node` on terminal 
if any node processes were previously running.)
(Assuming you are in the 35lproject repo folder)
```
cd App/client
npm run dev
```

### Putting in Google Maps API Key
1. Go to Google’s credential page: [Credentials Page](https://console.cloud.google.com/projectselector2/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_maps-backend&_gl=1*hokhuc*_ga*MTgxNTM2NjM0MS4xNzEwMTg2MzMy*_ga_NRWSTWS78N*MTcxMDI5MDA2MC4xLjEuMTcxMDI5MDIwMS4wLjAuMA)
2. Create a project and setup account
3. Select the project you want for this app
4. Fill out the dialog boxes and a API key should show up
5. Copy the API key
6. Replace "YOUR_API_KEY" in the index.html and Template.jsx files with your Google Maps API Key
