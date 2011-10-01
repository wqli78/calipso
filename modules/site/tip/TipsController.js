
/**
 *  Tips 控制器
 *  Created by create-controller script @ Fri Sep 23 2011 13:10:14 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Tip = mongoose.model('Tip'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'tips';

module.exports = {

	/**
	 * Index action, 通过/tips/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/tips'
	 * 想获得json格式使用 '/tips.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Tip.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/tips');    	
	                  
			  Tip.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, tips) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(tips.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{tips:tips,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Tip.schema.tree,['id','_id'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/tips/show.html view or via json
	 * Default mapping to GET '/tip/:id'
	 * For JSON use '/tip/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Tip.findById(req.params.id, function(err, tip) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(tip.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{tip:tip,myschema:myhelper.paichuJson(Tip.schema.tree,['id','_id'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/tips/edit.html view no JSON view.
	 * Default mapping to GET '/tip/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Tip.findById(req.params.id, function(err, tip) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{tip:tip,myschema:myhelper.paichuJson(Tip.schema.tree,['id','_id'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/tip/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Tip.findById(req.params.id, function(err, tip) {
	        
	    	if (!tip) return next(err);
	        
			for (var key in req.body.tip){tip[key]=req.body.tip[key];}
	    	
	        tip.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update tip: ' + err);
	          	  res.redirect('/tips');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(tip.toObject());
	              break;
	            default:
	              req.flash('info', 'Tip updated');
	              res.redirect('/tip/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/tips', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var tip = new Tip(req.body.tip);
		  
		  tip.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create tip: ' + err);
	      	  res.redirect('/tips');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(tip.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Tip created');
		      	  res.redirect('/tip/' + tip.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/tip/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Tip.findById(req.params.id, function(err, tip) {
		        
		    	if (!tip) { 
	  	    	  	req.flash('error','Unable to locate the tip to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	tip.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the tip!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Tip deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};