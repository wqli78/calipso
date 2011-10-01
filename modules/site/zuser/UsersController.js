
/**
 *  Users Controller
 *  Created by create-controller script @ Thu Sep 15 2011 02:16:09 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'users';
	
/* 排除json（source）中符合某数组（paichu）的字段,返回排除后的json */
function paichuJson2(source,paichu){
		  for (var key in paichu){delete source[paichu[key]]};
		  return source;
};


module.exports = {

	/**
	 * 账户设置页面
	 **/  
	inbox: function(req, res, next){
		res.render(ViewTemplatePath+'/inbox');
	},

	/**
	 * 账户设置页面
	 **/  
	admin_account: function(req, res, next){
	
		User.findById(req.params.id, function(err, user) {
			  if(err) return next(err);
			  
	console.log(user);
		      switch (req.query.admin_account) {
		        case '2':
					res.render(ViewTemplatePath+'/admin_account2',{user:user});
		          break;
		        case '3':
					res.render(ViewTemplatePath+'/admin_account3',{user:user});
		          break;
		        default:
					res.render(ViewTemplatePath+'/admin_account',{user:user});
					// res.render(ViewTemplatePath + "/show",{user:user,myschema:myhelper.paichuJson(User.schema.tree,['id','_id','dongtai'])});
		      }
		      
		  });
	},

	/**
	 * 用户控制面板页面
	 **/  
	dashboard: function(req, res, next){
		var Sickcase = mongoose.model('Sickcase');
		Sickcase.find( {created_by:req.session.user._id} , function(err,mysickcases) {
		
			  if(err) return next(err);
			res.render(ViewTemplatePath+'/dashboard',{mysickcases:mysickcases});
		});
		// res.render(ViewTemplatePath+'/dashboard');
	},

	/**
	 * 用户注销登录页面
	 **/  
	logout: function(req, res, next){
	  req.session.destroy(function(){
		res.redirect('/users/act/login');
	  });		  
	},
	/**
	 * 用户注册页面
	 **/  
	signup: function(req, res, next){
		res.render(ViewTemplatePath+'/signup');		  
	},
	  
	/**
	 * 用户登录页面
	 **/  
	login: function(req, res, next){
		  
		res.render(ViewTemplatePath+'/login');		  
	},

	/**
	 * 用户登录验证
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	login_post: function(req, res, next){
		  	
	  User.findOne({ email: req.body.user.email }, function(err, user) {
	  // console.log(user);
		if (user && user.authenticate(req.body.user.password)) {
			req.session.regenerate(function(){
				// 存储session,该session在服务重启后，自动消失。
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.cookie.maxAge = 360000000000;

				req.session.user = user;
				req.session.user_id = user.id;
				req.session.user_name = user.login;
				
				//测试cookie用法
				var minute = 600000000000;
				res.cookie('user_login',user.login,{maxAge:minute});
				res.cookie('user_id',user.id,{maxAge:minute});
				// if (req.cookies.user){
					// res.clearCookie('user');
					// req.flash('info','发现cookie并清除了');
				// }else{
					// res.cookie('iser','我是cookie',{maxAge:minute});
					// req.flash('info','创建cookie了');
				// }
							
				
				// console.log(req.session.user);
				req.flash('info', '登录成功！');
				res.redirect('/users/act/dashboard');
			})
		} else {
		  req.flash('error', '用户名或者密码错误，请重新输入!');
		  res.redirect('/user/act/login');
		}
	  }); 				  
	},



	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
		  
		  var user = new User();
		  
		  	      
	      User.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/users');    	
	                  
			  User.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, users) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(users.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{users:users,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(User.schema.tree,['id','_id','dongtai'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/user/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  User.findById(req.params.id, function(err, user) {
			  if(err) return next(err);
			  
	// console.log(user);
		      switch (req.params.format) {
		        case 'json':
		          res.send(user.toObject());
		          break;
		        default:
		        	res.render(ViewTemplatePath + "/show",{user:user,myschema:myhelper.paichuJson(User.schema.tree,['id','_id','dongtai'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  
		  User.findById(req.params.id, function(err, user) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{user:user,myschema:myhelper.paichuJson(User.schema.tree,['id','_id','dongtai'])});//传入需要自动显示的字段
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    User.findById(req.params.id, function(err, user) {
	        
	    	if (!user) return next(err);
	        
			for (var key in req.body.user){user[key]=req.body.user[key];}
	    	// user.name = req.body.user.name;
	    	
	        user.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update user: ' + err);
	          	  res.redirect('/users');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(user.toObject());
	              break;
	            default:
	              req.flash('info', 'User updated');
	              res.redirect('/user/' + req.params.id);
	          }
	        });
	      });
	},
	  
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  var user = new User(req.body.user);
		  				  	
		  user.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create user: ' + err);
	      	  res.redirect('/users');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(user.toObject());
		        break;
		      default:
				if (req.body.create_type=='signup'){
		    	  req.flash('info','注册成功，请登录邮箱查看验证邮件！');
				  res.redirect('/user/' + user.id);
				}else{				
		    	  req.flash('info','创建用户成功');
		      	  res.redirect('/user/' + user.id);
				}
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/user/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  User.findById(req.params.id, function(err, user) {
		        
		    	if (!user) { 
	  	    	  	req.flash('error','Unable to locate the user to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	user.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the user!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','User deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	},
	
	//批量创建多个用户,请求格式为 users/act/createmulti ，其中的act仅为占位使用，可以是任何字符
	createmulti: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;

		  /* 创建多个测试用户 */
		  for (var i=0 ;i<=20;i++){
			user = new User({name:'名字'+i , sex:'男', birthday : '1980-08-29'});
			user.save();
			console.log(i);
		  }
	      
		  
	      User.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/users');    	
	                  
			  User.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, users) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(users.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{users:users,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	}
	
};