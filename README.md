# codepen-clone


## Project Requirements:
* PostGres (recommended: v12+)
* Node.js (recommended: v12.14.+)


## Run Development environment

#### Create PostGres db:  
* DB Name: **codepen-dev**
* user: postgres
* pass: (none)

*Note: (`tempSol.sh` moves monaco-editor to /public - to be removed)*
```
bash tempSol.sh
npm install
npm start 
```

## Run Test environment

#### Create PostGres db:  
* DB Name: **codepen-test** 
* user: postgres
* pass: (none)


### R

*Note: (`tempSol.sh` moves monaco-editor to /public - to be removed)*
```
bash tempSol.sh
npm install
```

Run backend tests: 
```
npm test
```

Run front-end tests: 
```
npm fe-test
```


## Run Production environment


