#!/bin/bash

cd frontend
npm install && npm run build
cd ../backend
npm install && npm run start
