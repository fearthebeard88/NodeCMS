#! /bin/bash

export PORT=3000
export MONGO_PORT=27017

type nodemon > /dev/null
if [ $? -eq 0 ]
then
  nodemon app.js
else
  node app.js
fi
