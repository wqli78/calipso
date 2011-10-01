/**
 *  Cat schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Cat = new Schema({

	  // Single default property
	  name:{type: String, required: true, cn_name:'分类标题'},
	  body:{type: String, required: false, cn_name:'分类描述'},
	  f_id:{type: String, required: false, cn_name:'分类的父项'}
	  
});

mongoose.model('Cat', Cat);
