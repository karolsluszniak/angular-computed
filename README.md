# angular-computed

Computed property concept allows to produce more efficient and elegant scope properties. With **angular-translate** you get an easy way to define them using pattern similar to Dependency Injection, well known to all angular developers. Here are some advantages:

- views are simplified as you can use properties instead of function calls
- efficiency is gained as computation function is invoked only once after variable change
- computed properties are visually separated in controllers
- definition syntax is consistent with core angular concepts

Here's how to declare a computed property:

```js
var app = angular.module('app', ['ngComputed'])

app.controller('AppCtrl', ['$scope', function($scope) {
  // Some variables
  $scope.a = 2;
  $scope.b = 3;

  // Computed property
  $scope.$computed('mySum', ['a', 'b', function(a, b) {
    return a + b;
  }]);

  // Same as above, but won't work with minification
  $scope.$computed('mySum', function(a, b) {
    return a + b;
  });
}]);
```

Then, you can use it in your view like this:

```html
<div ng-controller="AppCtrl as app">
  <p>The sum is: {{ app.sum }}</p>
</div>
```

## Contributing

1. Fork it (https://github.com/karolsluszniak/angular-computed/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
