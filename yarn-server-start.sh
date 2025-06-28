#!/bin/bash

cd frontend
yarn && yarn build
cd ../backend
yarn && yarn start
