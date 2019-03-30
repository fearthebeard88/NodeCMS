#! /bin/bash

export PORT=80
export MONGO_PORT=27017
export NODE_ENV='development'
# export NODE_ENV='production'

type nodemon > /dev/null
if [ $? -eq 0 ]
then
  nodemon app.js
else
  node app.js
fi
