/**
 *  Comment schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Comment = new Schema({

	  // Single default property
	  name:{type: String, required: false, cn_name:'标题'}
	  ,body:{type: String, required: true, cn_name:'内容'}
	  ,post_id:{type: String, required: true, cn_name:'所属日志'}
	  ,created_by:{type: String, required: true, cn_name:'创建者id'}
	  ,created_by_login:{type: String, required: true, cn_name:'创建者登录名'}
	  ,updated_at :  { type: Date, default: Date.now , cn_name:'更新日期'}
	  ,created_at :  { type: Date, default: Date.now , cn_name:'创建日期'}
	  
});

mongoose.model('Comment', Comment);
