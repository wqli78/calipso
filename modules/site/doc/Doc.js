/**
 *  Doc schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Doc = new Schema({

	  // Single default property
	  title:{type: String, required: true, cn_name:'标题'}
	  ,body:{type: String, required: false, cn_name:'内容'}
	  ,created_by:{type: String, required: false, cn_name:'内容'}
	  ,type:{type: String, required: false,  enum: ['新闻资讯', '推荐阅读', '网站文档'], cn_name:'类别'}
	  
});

mongoose.model('Doc', Doc);
