/**
 *  Sickcase schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
	
//治疗大事
var Sick_points = new Schema({
    title     : {type: String, required: false , cn_name:'标题'}
  , body      : {type: String, required: false , cn_name:'内容'}
  , date      : {type: String, required: false , cn_name:'日期'}
});
//网站跟踪
var Web_trace = new Schema({
    title     : {type: String, required: false , cn_name:'标题'}
  , body      : {type: String, required: false , cn_name:'内容'}
  , date      : {type: String, required: false , cn_name:'日期'}
});
//求诊活动
var Treatments = new Schema({
    title     : {type: String, required: false , cn_name:'标题'}
  , body      : {type: String, required: false , cn_name:'内容'}
  , date      : {type: String, required: false , cn_name:'日期'}
});
//症状变化
var Symptoms = new Schema({
    title     : {type: String, required: true , cn_name:'标题'}
  , body      : {type: String, required: false , cn_name:'内容'}
  , date      : {type: String, required: false , cn_name:'日期'}
});
//案例动态
var Dongtai = new Schema({
    created_by     : {type: String, required: false , cn_name:'创建者id'}
  , created_by_login     : {type: String, required: false , cn_name:'创建者login'}
  , title     : {type: String, required: false , cn_name:'标题'}
  , body      : {type: String, required: false , cn_name:'内容'}
  , date      : { type: Date, default: Date.now , cn_name:'日期'}
});


var Sickcase = new Schema({

	  // Single default property
	  name:{type: String, required: true, cn_name:'名称'}
	  //定义了表间关系，只能使用一层关联。参考http://mongoosejs.com/docs/populate.html
	  ,created_by:{type: Schema.ObjectId, ref: 'User', required: true, cn_name:'创建者id'} 
	  ,created_by_login:{type: String, required: false, cn_name:'创建者登录名'}
	  ,sick_intro:{type: String, required: false, cn_name:'病情简介'}
	  ,sick_cat:{type: String, required: false, cn_name:'所属病种'}
	  ,sick_homepage:{type: String, required: false, cn_name:'案例网址'}
	  ,current_status:{type: String, required: false, cn_name:'当前状态'}//求医中或者治疗结束
	  ,treadments_num:{type: String, required: false, cn_name:'求诊次数'}
	  ,posts_num:{type: String, required: false, cn_name:'发布日志数量'}
	  ,show_num:{type: String, required: false, cn_name:'展示次数'}
	  ,guanzhu_num:{type: String, required: false, cn_name:'关注人数'}
	  ,shenhe:{type: String, required: false, cn_name:'审核'}
	  ,sick_describe:{type: String, required: false, cn_name:'病情详述'}
	  ,sick_points:{type: String, required: false, cn_name:'治疗大事'}
	  ,private_width:{type: String, required: false,enum: ['all', 'bingyou', 'private'], cn_name:'隐私范围'} //三个选项，公开、病友可见、完全私有
	  ,private_content:{type: String, required: false, cn_name:'隐私内容'}
	  ,next_trace_time:{type: String, required: false, cn_name:'下次追访时间'}
	  ,trace_period:{type: String, required: false, cn_name:'追访周期'}
	  ,updated_at :  { type: Date, default: Date.now , cn_name:'更新日期'}
	  ,created_at :  { type: Date, default: Date.now , cn_name:'创建日期'}
	  ,sick_points:[Sick_points]				//治疗大事记
	  ,web_trace:[Web_trace]					//网站跟踪状态
	  ,treatments:[Treatments]					//求诊活动
	  ,symptoms:[Symptoms]						//症状发展史
	  ,dongtai:[Dongtai]						//症状发展史
	  
	  
	  
	  
});

mongoose.model('Sickcase', Sickcase);
