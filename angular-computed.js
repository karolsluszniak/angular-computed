(function() { 'use strict';
  angular.module('ngComputed', []).run(['$rootScope', function($rootScope) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;

    function getParamNames(func) {
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null) {
        result = [];
      }

      return result;
    };

    function defineProperty(name, inject) {
      if (typeof inject === 'function') {
        var dependencies = getParamNames(inject);
        var compute = inject;
      } else {
        var dependencies = inject.slice(0, inject.length - 1);
        var compute = inject[inject.length - 1];
      }

      this.$watchGroup(dependencies, function(newVal, oldVal, scope) {
        scope[name] = compute.apply(scope, newVal);
      });
    };

    $rootScope.constructor.prototype.$computed = defineProperty;
  }]);
})();

