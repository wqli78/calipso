/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// 对此函数进行中文化改造
// long ago the date represents.
var rootpath = process.cwd() + '/',
  path = require('path'),
  calipsoDate = require(path.join(rootpath, "lib/Date")).CalipsoDate;

exports = module.exports = {

  prettyDate: function(stringDate) {

    var date = new Date(stringDate),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 )
      return;

    return day_diff == 0 && (
        diff < 60 && "刚刚发布" ||
        diff < 120 && "1分钟前" ||
        diff < 3600 && Math.floor( diff / 60 ) + " 分钟前" ||
        diff < 7200 && "1小时前" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " 小时前"
      ) ||
      day_diff == 1 && "昨天" ||
      day_diff < 7 && day_diff + " 天前" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " 星期以前"  ||
      day_diff >=31 && calipsoDate.formatDate('D, d M yy', date);
  },
  // Splits the date into 7 'hot' categories based on recency
  hotDate: function(stringDate) {

    var date = new Date(stringDate),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 )
      return;

    return day_diff == 0 && (
        diff < 7200 && "h1" ||
        diff < 86400 && "h2"
      ) ||
      day_diff == 1 && "h3" ||
      day_diff < 3 && "h4" ||
      day_diff < 5 && "h5" ||
      day_diff <= 7 && "h6" ||
      day_diff > 7 && "h7";
  }


};
