
/**
 *  Sickcases 控制器
 *  Created by create-controller script @ Fri Sep 16 2011 13:44:42 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Sickcase = mongoose.model('Sickcase'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'sickcases';

module.exports = {


	/**
	 * 显示病情描述页面
	 **/
	show_desc: function(req, res, next) {
       	res.render(ViewTemplatePath+'/show_desc');
	},

	/**
	 * 编辑案例显示页面
	 **/
	edit_view: function(req, res, next) {
       	res.render(ViewTemplatePath+'/edit_view');
	},

	/**
	 *显示案例
	 * Default mapping to GET '/sickcase/:id'
	 * For JSON use '/sickcase/:id.json'
	 **/	
	case_show: function(req, res, next) {	  		  
			
		// req.params.id=0;
		
		Sickcase.findById(req.params.id)
			// .populate('created_by',['login'])
			.run(function(err, sickcase) {
			  
			  if(err) return next(err);
			  

			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(sickcase.toObject());
		          break;
	
		        default:
				console.log(sickcase);
		        	res.render(ViewTemplatePath + "/case_show",{sickcase:sickcase});
		      }
		      
		});		
		

	},


	/**
	 * 创建案例处理post数据
	 **/
	create_post: function(req, res, next) {		  
		
		var sickcase = new Sickcase(req.body.sickcase);
		sickcase.dongtai.push({d_created_by:req.session.user._id ,d_created_by_login : req.session.user.login , title:'创建了案例' , body:'创建了新案例！'});
		  
		  sickcase.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','出现错误，不能创建案例: ' + err);
	      	  res.redirect('/sickcases/act/crate_view');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(sickcase.toObject());
		        break;
	
		      default:
		    	  req.flash('info','您的案例已经创建');
		      	  // res.redirect('/sickcase/' + sickcase.id);
	      	  res.redirect('/sickcases/'+sickcase._id+'/case_show');
			 }
		  });	  
		  
	},

	/**
	 * 创建案例显示页面
	 **/
	create_view: function(req, res, next) {
		var Cat = mongoose.model('Cat');
		Cat.find({})
			.find(function(err,cats){
				if(err) return next(err);
				res.render(ViewTemplatePath+'/create_view',{cats:cats});						
			});
					
	},

	/**
	 * 案例列表,带分页功能
	 **/
	case_list: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Sickcase.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/sickcases');    	
	                  
			  Sickcase.find({})
			  	.sort('name', 1)
				// .populate('created_by',['login'])
			  	.skip(from)
				.limit(to)
			  	.find(function (err, sickcases) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(sickcases.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:		
						// console.log(sickcases);
			        	res.render(ViewTemplatePath+'/case_list',{sickcases:sickcases,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},

	/**
	 * Index action, 通过/sickcases/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/sickcases'
	 * 想获得json格式使用 '/sickcases.json'
	 **/


	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Sickcase.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/sickcases');    	
	                  
			  Sickcase.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, sickcases) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(sickcases.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			     	
			        	res.render(ViewTemplatePath,{sickcases:sickcases,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Sickcase.schema.tree,['id','_id','dongtai','sick_points','web_trace','treatments','symptoms'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/sickcases/show.html view or via json
	 * Default mapping to GET '/sickcase/:id'
	 * For JSON use '/sickcase/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Sickcase.findById(req.params.id, function(err, sickcase) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(sickcase.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{sickcase:sickcase,myschema:myhelper.paichuJson(Sickcase.schema.tree,['id','_id','dongtai','sick_points','web_trace','treatments','symptoms'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/sickcases/edit.html view no JSON view.
	 * Default mapping to GET '/sickcase/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Sickcase.findById(req.params.id, function(err, sickcase) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{sickcase:sickcase,myschema:myhelper.paichuJson(Sickcase.schema.tree,['id','_id','dongtai','sick_points','web_trace','treatments','symptoms'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/sickcase/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Sickcase.findById(req.params.id, function(err, sickcase) {
	        
	    	if (!sickcase) return next(err);
	        
			for (var key in req.body.sickcase){sickcase[key]=req.body.sickcase[key];}
	    	
	        sickcase.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update sickcase: ' + err);
	          	  res.redirect('/sickcases');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(sickcase.toObject());
	              break;
	            default:
	              req.flash('info', 'Sickcase updated');
	              res.redirect('/sickcase/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/sickcases', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var sickcase = new Sickcase(req.body.sickcase);
		  
		  sickcase.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create sickcase: ' + err);
	      	  res.redirect('/sickcases');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(sickcase.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Sickcase created');
		      	  res.redirect('/sickcase/' + sickcase.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/sickcase/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Sickcase.findById(req.params.id, function(err, sickcase) {
		        
		    	if (!sickcase) { 
	  	    	  	req.flash('error','Unable to locate the sickcase to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	sickcase.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the sickcase!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Sickcase deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};