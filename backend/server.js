const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();
 
app.use(express.static("public"));
app.use(express.json());

