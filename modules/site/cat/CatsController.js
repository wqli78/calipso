
/**
 *  Cats 控制器
 *  Created by create-controller script @ Fri Sep 23 2011 13:06:07 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Cat = mongoose.model('Cat'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'cats';

module.exports = {

	/**
	 * 病种类别列表
	 **/
	cats_list: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Cat.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/cats_list');    	
	                  
			  Cat.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, cats) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(cats.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath+'/cats_list',{cats:cats,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Cat.schema.tree,['id','_id'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	/**
	 * Index action, 通过/cats/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/cats'
	 * 想获得json格式使用 '/cats.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Cat.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/cats');    	
	                  
			  Cat.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, cats) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(cats.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{cats:cats,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Cat.schema.tree,['id','_id'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/cats/show.html view or via json
	 * Default mapping to GET '/cat/:id'
	 * For JSON use '/cat/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Cat.findById(req.params.id, function(err, cat) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(cat.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{cat:cat,myschema:myhelper.paichuJson(Cat.schema.tree,['id','_id'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/cats/edit.html view no JSON view.
	 * Default mapping to GET '/cat/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Cat.findById(req.params.id, function(err, cat) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{cat:cat,myschema:myhelper.paichuJson(Cat.schema.tree,['id','_id'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/cat/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Cat.findById(req.params.id, function(err, cat) {
	        
	    	if (!cat) return next(err);
	        
			for (var key in req.body.cat){cat[key]=req.body.cat[key];}
	    	
	        cat.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update cat: ' + err);
	          	  res.redirect('/cats');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(cat.toObject());
	              break;
	            default:
	              req.flash('info', 'Cat updated');
	              res.redirect('/cat/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/cats', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var cat = new Cat(req.body.cat);
		  
		  cat.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create cat: ' + err);
	      	  res.redirect('/cats');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(cat.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Cat created');
		      	  res.redirect('/cat/' + cat.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/cat/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Cat.findById(req.params.id, function(err, cat) {
		        
		    	if (!cat) { 
	  	    	  	req.flash('error','Unable to locate the cat to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	cat.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the cat!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Cat deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};