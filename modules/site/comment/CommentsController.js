
/**
 *  Comments 控制器
 *  Created by create-controller script @ Sat Sep 24 2011 10:22:09 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Comment = mongoose.model('Comment'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'comments';

module.exports = {


	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/comments', no GET mapping	 
	 **/  
	create_comment: function(req, res, next){
		  
		  var comment = new Comment(req.body.comment);
		  comment.created_by = req.session.user._id;
		  comment.created_by_login = req.session.user.login;
		  comment.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create comment: ' + err);
	      	  res.redirect('/posts/'+req.body.comment.post_id+'/post_show');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(comment.toObject());
		        break;
	
		      default:
		    	  req.flash('info','回复成功！');
				  console.log(req.body.sickcase);
				  console.log('1111111');
				  console.log(req.body.sickcase._id);
		      	  res.redirect('/posts/' + req.body.comment.post_id + '/post_show?sickcaseid='+req.body.sickcase._id);
			 }
		  });	  
		  
	},

	/**
	 * Index action, 通过/comments/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/comments'
	 * 想获得json格式使用 '/comments.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Comment.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/comments');    	
	                  
			  Comment.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, comments) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(comments.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{comments:comments,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Comment.schema.tree,['id','_id'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/comments/show.html view or via json
	 * Default mapping to GET '/comment/:id'
	 * For JSON use '/comment/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Comment.findById(req.params.id, function(err, comment) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(comment.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{comment:comment,myschema:myhelper.paichuJson(Comment.schema.tree,['id','_id'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/comments/edit.html view no JSON view.
	 * Default mapping to GET '/comment/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Comment.findById(req.params.id, function(err, comment) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{comment:comment,myschema:myhelper.paichuJson(Comment.schema.tree,['id','_id'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/comment/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Comment.findById(req.params.id, function(err, comment) {
	        
	    	if (!comment) return next(err);
	        
			for (var key in req.body.comment){comment[key]=req.body.comment[key];}
	    	
	        comment.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update comment: ' + err);
	          	  res.redirect('/comments');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(comment.toObject());
	              break;
	            default:
	              req.flash('info', 'Comment updated');
	              res.redirect('/comment/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/comments', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var comment = new Comment(req.body.comment);
		  
		  comment.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create comment: ' + err);
	      	  res.redirect('/comments');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(comment.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Comment created');
		      	  res.redirect('/comment/' + comment.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/comment/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Comment.findById(req.params.id, function(err, comment) {
		        
		    	if (!comment) { 
	  	    	  	req.flash('error','Unable to locate the comment to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	comment.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the comment!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Comment deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};