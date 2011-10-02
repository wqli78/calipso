/**
 * Calipso is included in every module
 */
var rootpath = process.cwd() + '/',
  path = require('path'),
  calipso = require(path.join(rootpath, 'lib/calipso'));
  Query = require("mongoose").Query;


/**
 * Exports
 * Note that any hooks must be exposed here to be seen by Calipso
 */
exports = module.exports = {
  init: init,
  route: route,
  install: install,
  reload: reload,
  disable: disable,
  depends:["content","contentTypes"]
};

/**
 * Template module
 */

function route(req, res, module, app, next) {

  // Menus
  //res.menu.primary.push({ name: 'sickcase', url: '/sickcase', regexp: /sickcase/ });
  res.menu.primary.addMenuItem({name:'中医案例',path:'sickcase',url:'/sickcase',description:'中医案例 ...',security:[]});
  
  // Routes
  module.router.route(req, res, next);

};

function init(module, app, next) {


   //If dependent on another module (e.g. content):
   //if(!calipso.modules.content.initialised) {
   //process.nextTick(function() { init(module,app,next); });
   //return;
   //}

  // Any pre-route config
  calipso.lib.step(

  function defineRoutes() {

    // Add a route to every page, notice the 'end:false' to ensure block further routing
    //module.router.addRoute(/.*/, allPages, {end:false, template:'template-all', block:'right'}, this.parallel());
    app.use(calipso.lib.express.static(__dirname + '/static'));

    // Page

    module.router.addRoute('GET /sickcase/list', case_list, {end:false,template:'case_list',block:'content.sickcase.case_list'}, this.parallel());
    module.router.addRoute('GET /sickcase/case_show/:id', case_show, {
      template: 'case_show',
      block: 'content'
    }, this.parallel());
    module.router.addRoute('GET /sickcase/edit_view/:id', edit_view, {
      template: 'edit_view',
      block: 'content'
    }, this.parallel());
    module.router.addRoute('GET /sickcase/create_view', create_view, {
      template: 'create_view',
      block: 'content'
    }, this.parallel());
    module.router.addRoute('POST /sickcase/create_post', create_post, null, this.parallel());
    module.router.addRoute('POST /sickcase', renderSampleContentPage, {
      template: 'sickcase',
      block: 'content'
    }, this.parallel());

  }, function done() {

	require('./sickcase_model');
    // Any schema configuration goes here
    next();
  });

};

/**
 * Render sample content
 */
function renderSampleContentPage(req, res, template, block, next) {

  calipso.form.process(req, function(incomingForm) {

    var sampleForm = {
      id: 'sickcase-form',
      cls: 'sickcase-form',
      title: 'sickcase Form',
      type: 'form',
      method: 'POST',
      action: '/sickcase',
      fields: [{
        label: 'Text',
        name: 'sample-text',
        type: 'text'
      }, {
        label: 'Textarea',
        name: 'sample-textarea',
        type: 'textarea'
      }, {
        label: 'Password',
        name: 'sample-password',
        type: 'password'
      },
      // "simple" select (values are used for displayed text also):
      {
        label: 'Select (simple)',
        name: 'sample-select-simple',
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3']
      },
      // typical select (values may differ from displayed text):
      {
        label: 'Select (typical)',
        name: 'sample-select-typical',
        type: 'select',
        options: [{
          label: 'alpha',
          value: '1'
        }, {
          label: 'beta',
          value: '2'
        }, {
          label: 'gamma',
          value: '3'
        }]
      },
      // optgroup select (has optgroups with both simple and typical option sets):
      {
        label: 'Select (optgroups)',
        name: 'sample-select-optgroups',
        type: 'select',
        optgroups: [{
          label: 'Option Group 1',
          options: ['Option 1', 'Option 2', 'Option 3']
        }, {
          label: 'Option Group 2',
          options: [{
            label: 'delta',
            value: '4'
          }, {
            label: 'epsilon',
            value: '5'
          }, {
            label: 'zeta',
            value: '6'
          }]
        }, {
          label: 'Option Group 3',
          options: ['Option 7', 'Option 8', 'Option 9']
        }]
      }, {
        label: 'Radio 1',
        name: 'radios',
        type: 'radio',
        value: '1'
      }, {
        label: 'Radio 2',
        name: 'radios',
        type: 'radio',
        value: '2'
      }, {
        label: 'Radio 3',
        name: 'radios',
        type: 'radio',
        value: '3'
      }, {
        label: 'Checkbox 1',
        name: 'checkbox1',
        type: 'checkbox',
        value: '1'
      }, {
        label: 'Checkbox 2',
        name: 'checkbox2',
        type: 'checkbox',
        value: '2'
      }, {
        label: 'Checkbox 3',
        name: 'checkbox3',
        type: 'checkbox',
        value: '3'
      }, {
        label: 'File',
        name: 'file',
        type: 'file'
      }, ],
      buttons: [{
        name: 'cancel',
        type: 'button',
        link: '/',
        value: 'Cancel'
      }, {
        name: 'reset',
        type: 'reset',
        value: 'Reset'
      }, {
        name: 'submit',
        type: 'submit',
        value: 'Submit'
      }]
    };

    calipso.form.render(sampleForm, incomingForm, req, function(form) {
      calipso.theme.renderItem(req, res, template, block, {form: form}, next);
    });

  });
};


/**
 * hook for installing
 * @returns
 */

function install() {
  calipso.log("sickcase module installed");
}

/**
 * hook for disabling
 */

function disable() {
  calipso.log("sickcase module disabled");
}

/**
 * hook for reloading
 */

function reload() {
  calipso.log("sickcase module reloaded");
}



	/**
	 * 显示病情描述页面
	 **/
function show_desc(req, res, template, block, next) {
       	res.render(ViewTemplatePath+'/show_desc');
	}

	/**
	 * 编辑案例显示页面
	 **/
function edit_view (req, res, template, block, next) {
		
		var sickcase = {};//占位
		
		calipso.theme.renderItem(req, res, template, block, {sickcase:sickcase}, next);	
	}

	/**
	 *显示案例
	 * Default mapping to GET '/sickcase/:id'
	 * For JSON use '/sickcase/:id.json'
	 **/	
function case_show (req, res, template, block, next) {	  		  
			
		// req.params.id=0;

		var Sickcase = calipso.lib.mongoose.model('Sickcase');			
		Sickcase.findById(req.moduleParams.id)
			.run(function(err, sickcase) {
				if(err) return next(err);
				calipso.theme.renderItem(req, res, template, block, {sickcase:sickcase}, next);	
				// res.render(ViewTemplatePath + "/case_show",{sickcase:sickcase});
		});		
	}


	/**
	 * 创建案例处理post数据
	 **/
function create_post (req, res, template, block, next) {		

		//标准提交方法，对提交的form进行处理，删除空数据，美化日期等处理
		calipso.form.process(req, function(form) {

		if(form) {
			var Sickcase = calipso.lib.mongoose.model('Sickcase');	 
			var sickcase = new Sickcase(form.sickcase);
			sickcase.dongtai.push({created_by:req.session.user._id ,created_by_login : req.session.user.login , title:'创建了案例' , body:'创建了新案例！'});
			
			  sickcase.save(function(err) {
			   
				if (err) {
					console.log(err);
				  req.flash('error','出现错误，不能创建案例: ' + err);
				  res.redirect('/sickcase/create_view');
				  return;
				}else{

				req.flash('info','您的案例已经创建');
				res.redirect('/sickcase/case_show/'+sickcase._id);				
				
				}
			  });	 
		}
		});
	}

	/**
	 * 创建案例显示页面
	 **/
function	create_view (req, res, template, block, next) {
/* 		var Cat = mongoose.model('Cat');
		Cat.find({})
			.find(function(err,cats){
				if(err) return next(err);

				calipso.theme.renderItem(req, res, template, block, {cats:cats}, next);					
			});
				 */	
		var cats = [];
		calipso.theme.renderItem(req, res, template, block, {cats:cats}, next);	
	}

	
	

	/**
	 * 案例列表,带分页功能
	 **/
function	case_list (req, res, template, block, next) {

	var Sickcase = calipso.lib.mongoose.model('Sickcase');	
	var pager = require(path.join(rootpath, 'utils/pagerZhongyi'));
	
	var format = req.moduleParams.format ? req.moduleParams.format : 'html';
	var from = req.moduleParams.from ? parseInt(req.moduleParams.from) - 1 : 0;
	var limit = req.moduleParams.limit ? parseInt(req.moduleParams.limit) : 2;
	var sortBy = req.moduleParams.sortBy;

	var query = new Query();

      // Initialise the block based on our content
	Sickcase.count(query, function (err, count) {
		var total = count;

		var qry = Sickcase.find(query).skip(from).limit(limit).sort('created_at','desc');

		qry.find(function (err, sickcases) {
 		
			var pagerHtml=pager.render(from,limit,total,req.url);
		
			calipso.theme.renderItem(req,res,template,block,{sickcases:sickcases,pagerHtml:pagerHtml},next);

			if(format === 'json') {
				res.format = format;
				res.send(Sickcase.map(function(u) {
					return u.toObject();
				}));
				next();
			}

		});


  });	
}
