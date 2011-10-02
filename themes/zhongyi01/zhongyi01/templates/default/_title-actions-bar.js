/**
 * Additional content section / block functions for body.
 */

var rootpath = process.cwd() + '/',
  path = require('path'),
  calipso = require(path.join(rootpath, 'lib/calipso'));

exports = module.exports = function(req, options, callback) {

  /**
   *  Get additional content for blocks in the template
   */
  calipso.lib.step(
    function getContent() {

      // options.getContent(req, 'about-me', this.parallel());
      // options.getBlock('tagcloud',this.parallel());
      options.getBlock(/^_title-actions-bar.*/,this.parallel());

      // Demonstration of how to use getModuleFn
      options.getModuleFn(req,'template.templatePage',{template:'templateShow'},this.parallel());

    },
    function done(err, about,tagcloud,side,fn) {
      callback(err,{_title-actions-bar:_title-actions-bar, fn:fn});
    }
  );


};