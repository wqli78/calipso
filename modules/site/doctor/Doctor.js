﻿/**
 *  Doctor schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Doctor = new Schema({

	  // Single default property
	  name:{type: String, required: true, cn_name:'标题'}
	  
});

mongoose.model('Doctor', Doctor);
