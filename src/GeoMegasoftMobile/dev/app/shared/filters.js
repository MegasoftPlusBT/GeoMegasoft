angular.module('starter.shared')
  .filter('rawHtml', function($sce) {
    return function(val) {
      val = val.replace('<script', '<div style="display:none"');
      return $sce.trustAsHtml(val);
    };
  });
