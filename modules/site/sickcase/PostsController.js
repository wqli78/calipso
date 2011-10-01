
/**
 *  Posts 控制器
 *  Created by create-controller script @ Fri Sep 16 2011 15:43:11 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Post = mongoose.model('Post'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'posts';

module.exports = {





	/**
	 * 显示单个日志
	 **/	
	post_show: function(req, res, next) {	  		  

		var Comment = mongoose.model('Comment');
		
		Comment.find({post_id:req.params.id},function(err,comments){
			if (err) return next(err);
			  
			  Post.findById(req.params.id, function(err, post) {

				  if(err) return next(err);

						var Sickcase = mongoose.model('Sickcase');
						Sickcase.findById(req.query.sickcaseid,function(err,sickcase){
							if(err) return next(err);
							// console.log(post);
							res.render(ViewTemplatePath + "/post_show",{post:post,sickcase:sickcase,comments:comments});
						});
				  
			  });
		  });
		    
	},

	/**
	 * posts_list, 通过/posts/posts_list.html 视图返回列表 
	 **/
	posts_list: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Post.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/posts/act/posts_list');    	
	                  
			  Post.find({})
			  	.sort('title', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, posts) {
				
				  if(err) return next(err);
				  
						var Sickcase = mongoose.model('Sickcase');
						Sickcase.findById(req.query.sickcaseid,function(err,sickcase){
							if(err) return next(err);
								// console.log(post);
							res.render(ViewTemplatePath+'/posts_list',{posts:posts,sickcase:sickcase,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Post.schema.tree,['id','_id','pictures','videos'])});
						});
			  });
	      
	      });
	      	  	
	},
	
	/* 显示日志的界面 */
	create_view: function(req, res, next) {
		var Sickcase = mongoose.model('Sickcase');
		Sickcase.findById(req.query.sickcaseid,function(err,sickcase){
			if(err) return next(err);
			// console.log(post);
		res.render(ViewTemplatePath+'/create_view',{sickcase:sickcase});	
		});
	},

	/* 处理日志提交内容 */
	create_post: function(req, res, next) {
		  var post = new Post(req.body.post);
		  
		  post.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','无法创建日志: ' + err);
	      	  res.redirect('/post/act/create_view');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(post.toObject());
		        break;
	
		      default:
		    	  req.flash('info','日志已经创建');
		      	  res.redirect('/post/' + post.id +'/post_show?sickcaseid='+ post.sickcase);
			 }
		  });	  
	},



	/**
	 * Index action, 通过/posts/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/posts'
	 * 想获得json格式使用 '/posts.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Post.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/posts');    	
	                  
			  Post.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, posts) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(posts.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{posts:posts,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Post.schema.tree,['id','_id','pictures','videos'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/posts/show.html view or via json
	 * Default mapping to GET '/post/:id'
	 * For JSON use '/post/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Post.findById(req.params.id, function(err, post) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(post.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{post:post,myschema:myhelper.paichuJson(Post.schema.tree,['id','_id','pictures','videos'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/posts/edit.html view no JSON view.
	 * Default mapping to GET '/post/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Post.findById(req.params.id, function(err, post) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{post:post,myschema:myhelper.paichuJson(Post.schema.tree,['id','_id','pictures','videos'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/post/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Post.findById(req.params.id, function(err, post) {
	        
	    	if (!post) return next(err);
	        
			for (var key in req.body.post){post[key]=req.body.post[key];}
	    	
	        post.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update post: ' + err);
	          	  res.redirect('/posts');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(post.toObject());
	              break;
	            default:
	              req.flash('info', 'Post updated');
	              res.redirect('/post/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/posts', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var post = new Post(req.body.post);
		  
		  post.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create post: ' + err);
	      	  res.redirect('/posts');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(post.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Post created');
		      	  res.redirect('/post/' + post.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/post/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Post.findById(req.params.id, function(err, post) {
		        
		    	if (!post) { 
	  	    	  	req.flash('error','Unable to locate the post to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	post.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the post!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Post deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};