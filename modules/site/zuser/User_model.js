
/**
 *  User schema
 *  Created by create-model script  
 **/
var mongoose = require('mongoose')
	,crypto = require('crypto')
	,Schema = mongoose.Schema
	,ObjectId = Schema.ObjectId;
	
	
//角色表
var Role = new mongoose.Schema({
	name:{type: String, required: true, unique:true},
	description:{type: String,"default":''},
	isAdmin:{type: Boolean, required: true, "default": false},
	isDefault:{type: Boolean, required: true, "default": false}
});


//嵌入式文档，说明地址：http://mongoosejs.com/docs/embedded-documents.html
var Dongtai = new Schema({
	title     : {type: String, required: true , cn_name:'标题'}
  , body      : {type: String, required: true , cn_name:'内容'}
  , date      : {type: String, required: true , cn_name:'日期'}
});


var User = new Schema({

	  // calipso框架缺省的用户字段

	username:{type: String, required: true, unique:true},
	fullname:{type: String, required: false},
	password:{type: String, required: false},
	hash:{type: String, required: true, "default":''},
	email:{type: String, required: true, unique:true},
	showName:{type: String, "default":'registered'},
	showEmail:{type: String, "default":'registered'},
	about:{type: String},
	language:{type: String, "default":'en'},
	roles:[String],
	locked:{type: Boolean, "default":false}		
	
	
	//以下为zhongyi01自定义的user表字段
	,name		:	{												//姓名
					first: String
				  , last: String
				}				
	,sex		:	{type: String, required: false, cn_name:'性别'}
	,phone	:	{type: String, required: false, cn_name:'座机'}
	,mobile	:	{type: String, required: false, cn_name:'手机'}
	,qq	:		{type: String, required: false, cn_name:'QQ'}		
	,age   	:  	{ type: String, min: 18, index: true , cn_name:'年龄'} 	
	,ident_id	:	{type: String, required: false, cn_name:'身份证号'}			
	,netname:		{type: String, required: false, cn_name:'网名'}		
	,birthday	:	{type: String, required: false, cn_name:'生日'}
	,country	:	{type: String, required: false, default:'中国',cn_name:'国家'}
	,province	:	{type: String, required: false, cn_name:'省'}
	,city		:	{type: String, required: false, cn_name:'城市'}
	,jiedao	:	{type: String, required: false, cn_name:'村镇街道'}
	,note		:	{type: String, default:'祝福大家！',required: false, cn_name:'说明'}
	,sicktype	:	{type: String, required: false, cn_name:'疾病类型'}		
	,active	:	{type: String, required: false, cn_name:'邮件激活'}			
	,score	:	{type: String, required: false, cn_name:'积分'}			
	,plan	:		{type: String, required: false,  enum: ['free', 'pay1', 'pay2','pay3'],cn_name:'付费计划'}			
	,dongtai	:	[Dongtai]												//动态信息
	,updated_at :  { type: Date, default: Date.now , cn_name:'更新日期'}
	,created_at :  { type: Date, cn_name:'创建日期'}

	  
	  
});

//虚拟属性，用于姓、名组合，或者地址的国家、省、市、街道组合
//参考文档：http://mongoosejs.com/docs/virtuals.html
User
	.virtual('name.full')
	.get(function () {
	  return this.name.first + ' ' + this.name.last;
	})
	.set(function (setFullNameTo) {
	  var split = setFullNameTo.split(' ')
		, firstName = split[0]
		, lastName = split[1];

	  this.set('name.first', firstName);
	  this.set('name.last', lastName);
	});

//使用插件功能，使密码在进行创建或更新的时候，自动对密码进行md5加密
//参考地址http://mongoosejs.com/docs/plugins.html
var password_md5b = require('./pluginSecretPassword');
User.plugin(password_md5b);


//定义model中的一些方法 ，参考地址：http://mongoosejs.com/docs/methods-statics.html
User.method('authenticate', function(plainText) {
	
  return plainText === this.password;
  // return plainText === this.password;
});

mongoose.model('User', User);
mongoose.model('Role', Role);
