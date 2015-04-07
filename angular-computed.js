(function() {'use strict';
  angular.module('ngComputed', [])

  .service('$computed', ['$rootScope', '$q', function($rootScope, $q) {
    function touchKey(name) {
      return '$$computed-touch-' + name;
    }

    function controller(context, name) {
      return {
        touch: function() {
          return (context[touchKey(name)] = (context[touchKey(name)] || 0) + 1);
        }
      };
    }

    return function angularComputed(context, name, properties) {
      /* computed(this) in controller injects service into the controller context */
      if (typeof context === 'object' && name === undefined) {
        context.$computed = angularComputed;
        return context;
      }

      /* computed(name, properties) uses this for context */
      if (typeof context === 'string') {
        properties = name;
        name       = context;
        context    = this;
      }

      /* computed([context], name) returns controller */
      if (properties === undefined) {
        return controller(context, name);
      }

      /* last element in properties array is a compute function */
      var valueFunc = properties.splice(properties.length - 1)[0],
          version = 0;

      /* watch a group of specified properties and evaluate compute function */
      $rootScope.$watchGroup(properties.concat([touchKey(name)]).map(function(item) {
        if (typeof item === 'string') {
          return function() { return context[item]; };
        } else if (typeof item === 'function') {
          return angular.bind(context, item);
        }
      }), function(newValues) {
        var thisVer   = ++version,
            valid     = function valid() { return thisVer === version; },
            valueArgs = newValues.slice(0, newValues.length - 1).concat([valid]),
            promise   = $q.when(valueFunc.apply(context, valueArgs));

        promise.then(function(response) {
          if (valid()) {
            context[name] = response;
          }
        });
      });

      return controller(context, name);
    };
  }])

  /* provide scope.$computed(name, properties) on all scopes */
  .run(['$rootScope', '$computed', function($rootScope, $computed) {
    $computed($rootScope);
  }]);
})();
