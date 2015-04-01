(function() {'use strict';
  angular.module('ngComputed', []).

  service('$computed', ['$rootScope', '$q', function($rootScope, $q) {
    return function angularCmputed(context, name, properties) {
      /* computed(this) in controller injects service into the controller context */
      if (typeof context === 'object' && name === undefined) {
        context.$computed = angularCmputed;
        return;
      }

      /* computed(name, properties) uses this for context */
      if (typeof context === 'string') {
        properties = name;
        name       = context;
        context    = this;
      }

      /* last element in properties array is a compute function */
      var valueFunc = properties.splice(properties.length - 1)[0];

      /* watch a group of specified properties and evaluate compute function */
      $rootScope.$watchGroup(properties.map(function(item) {
        if (typeof item === 'string') {
          return function() { return context[item]; };
        } else if (typeof item === 'function') {
          return angular.bind(context, item);
        }
      }), function(newValues) {
        var promise = $q.when(valueFunc.apply(context, newValues));

        promise.then(function(response) {
          context[name] = response;
        });
      });
    };
  }]).

  /* provide scope.$computed(name, properties) on all scopes */
  run(['$rootScope', '$computed', function($rootScope, $computed) {
    $computed($rootScope);
  }]);
})();
