# codepen-clone


## Project Requirements:
* PostGres (recommended: v12+)
* Node.js (recommended: v12.14.+)
* (Windows only) win-node-env: https://github.com/laggingreflex/win-node-env


## Run Development environment

#### Create PostGres db:  
* DB Name: **codepen-dev**

Remember to update your `config.json` with the correct DB name.
If you don't have a config, initialize with: `sequelize init`


#### Run commands:  

```
npm install
npm start 
```

## Run Test environment

#### Create PostGres db:  
* DB Name: **codepen-test** 


#### Run commands:  

```
npm install
```

Run backend tests: 
```
npm test
```

Run front-end tests: 

**Ensure that you have `testcafe` installed. Preferably globally. 
https://www.npmjs.com/package/testcafe

```
npm run fe-test
```


## Run Production environment




## Troubleshooting:

On Windows - if port 3000 is already in use by prior process , open cmd and run:
```
taskkill /F /IM node.exe
```

On Windows - if `nodemon` doesn't work...

TBD
