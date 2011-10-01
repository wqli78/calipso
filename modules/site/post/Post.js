/**
 *  Post schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
	
	
var Pictures = new Schema({
    title     : {type: String, required: true , cn_name:'标题'}
  , body      : {type: String, required: true , cn_name:'内容'}
  , date      : {type: String, required: true , cn_name:'日期'}
});

var Videos = new Schema({
    title     : {type: String, required: true , cn_name:'标题'}
  , body      : {type: String, required: true , cn_name:'内容'}
  , date      : {type: String, required: true , cn_name:'日期'}
});


var Post = new Schema({

	  // Single default property
	  title:{type: String, required: true, cn_name:'标题'}
	  ,body:{type: String, required: false, cn_name:'内容'}
	  ,auther:{type: String, required: false, cn_name:'作者'}
	  ,sickcase:{type: String, required: false, cn_name:'所属案例id'}
	  ,treatment:{type: String, required: false, cn_name:'所属治疗活动'} //可以为空，即无求诊日志
	  ,updated_at :  { type: Date, default: Date.now , cn_name:'更新日期'}
	  ,created_at :  { type: Date, default: Date.now , cn_name:'创建日期'}
	  ,pictures	:	[Pictures]												//图片
	  ,videos	:	[Videos]												//视频
	  
});

mongoose.model('Post', Post);
