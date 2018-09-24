# linkages dashboard app
App to process data from rapidpro/excel like survey and to display a standardized dashboard

## Installation

### Ubuntu
This solution is deployed on ubuntu 14.04 or 16.04.
### MongoDB
* [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) and start the mongodb-org-server with the command
```sh
sudo service mongod start
```
### Clone the app on your Host
```sh
git clone https://github.com/gerard-bisama/linkage-dashboard.git
```
Then configure parameters of the manisfest.webapp file based on the explanation below
```sh
"rapidProDataSource":[ {
      "apiurl": "http://IP:PORT/api/v2", #IP and PORT of the rapidpro servers
      "token": "XXXXXXXXX", #RapidPro instance token
      "country":"Country" #Name of the country dashboard, any name
    }
  ],
  "administrator":{
      "username":"username",
      "password":"password"
  },
  ....
  
```

if the configuration are done,
Install the dependencies, node packages
```sh
cd linkage-dashboard
npm install
npm start
```
The service is exposed on the port 8084 (this could be changed)


Taratataaa
