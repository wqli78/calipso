
/**
 *  Doctors 控制器
 *  Created by create-controller script @ Sat Sep 24 2011 06:00:07 GMT+0000 (   )
 **/
 var mongoose = require('mongoose'),	
	Doctor = mongoose.model('Doctor'),
	pager = require('../utils/pager.js'),
	myhelper = require('../utils/myhelper.js'),
	ViewTemplatePath = 'doctors';

module.exports = {

	/**
	 * Index action, 通过/doctors/index.html 视图返回列表 或者通过json格式获得
	 * 缺省路由： to GET '/doctors'
	 * 想获得json格式使用 '/doctors.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Doctor.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/doctors');    	
	                  
			  Doctor.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, doctors) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(doctors.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{doctors:doctors,pagerHtml:pagerHtml,myschema:myhelper.paichuJson(Doctor.schema.tree,['id','_id'])});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/doctors/show.html view or via json
	 * Default mapping to GET '/doctor/:id'
	 * For JSON use '/doctor/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Doctor.findById(req.params.id, function(err, doctor) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(doctor.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{doctor:doctor,myschema:myhelper.paichuJson(Doctor.schema.tree,['id','_id'])});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/doctors/edit.html view no JSON view.
	 * Default mapping to GET '/doctor/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Doctor.findById(req.params.id, function(err, doctor) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{doctor:doctor,myschema:myhelper.paichuJson(Doctor.schema.tree,['id','_id'])});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/doctor/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Doctor.findById(req.params.id, function(err, doctor) {
	        
	    	if (!doctor) return next(err);
	        
			for (var key in req.body.doctor){doctor[key]=req.body.doctor[key];}
	    	
	        doctor.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update doctor: ' + err);
	          	  res.redirect('/doctors');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(doctor.toObject());
	              break;
	            default:
	              req.flash('info', 'Doctor updated');
	              res.redirect('/doctor/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/doctors', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var doctor = new Doctor(req.body.doctor);
		  
		  doctor.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create doctor: ' + err);
	      	  res.redirect('/doctors');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(doctor.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Doctor created');
		      	  res.redirect('/doctor/' + doctor.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/doctor/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Doctor.findById(req.params.id, function(err, doctor) {
		        
		    	if (!doctor) { 
	  	    	  	req.flash('error','Unable to locate the doctor to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	doctor.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the doctor!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Doctor deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};