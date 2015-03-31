# angular-computed

Computed property concept allows to produce more efficient and elegant scope properties. With **$computed** you get an easy way to define them using pattern similar to Dependency Injection, well known to all angular developers. Here are some advantages:

- views are simplified as you can use properties instead of function calls
- efficiency is gained as computation function is invoked only once after variable change
- computed properties are visually separated in controller code
- definition syntax is consistent with core Angular concepts

Internally, **$computed** is very simple and mostly based on `$watch` ability of Angular Scope. It's just a tiny, clean pattern implementation.

## Usage

First off, add `angular-computed.js` file to your project. You can download it from [here](https://raw.githubusercontent.com/karolsluszniak/angular-computed/master/angular-computed.js) or require bower `angular-computed` package.

Then, add `ngComputed` as your app's dependency:

```js
var app = angular.module('app', ['ngComputed']);
```

**$computed** works both with `controller as` syntax introduced in Angular 1.2 and with explicit `$scope` injected into controllers, services etc.

### With `controller as`

Here's how to declare a computed property when you use `controller as`:

```js
app.controller('AppCtrl', ['$computed', function($computed) {
  // Input variables
  this.a     = 15;
  this.b     = 32;
  this.const = 1;

  // Computed property
  $computed(this, 'sum', ['a', 'b', function(a, b) {
    // You can still use *this* inside computing function

    return a + b + this.const;
  }]);
}]);
```

Then, you can use it in your view like this:

```html
<div ng-controller="AppCtrl as app">
  <p>The sum is: {{ app.sum }}</p>
</div>
```

### With `$scope`

Here's how to declare a computed property when you use `$scope` injection:

```js
app.controller('AppCtrl', ['$scope', function($scope) {
  // Input variables
  $scope.a     = 15;
  $scope.b     = 32;
  $scope.const = 1;

  // Computed property
  $scope.$computed('sum', ['a', 'b', function(a, b) {
    // Here, *this* refers to your scope

    return a + b + this.const;
  }]);
}]);
```

Then, you can use it in your view like this:

```html
<div ng-controller="AppCtrl">
  <p>The sum is: {{ sum }}</p>
</div>
```

### Defining dependencies

You can provide dependencies as strings with property names:

```js
  $computed(this, 'sum', ['a', 'b', computeFunc]);
```

Or, if you need more control, as functions:

```js
  this.nested = { num: 31 };

  var local = 49;
  var computeFunc = function(nestedNum, localNum) {
    return nestedNum + localNum;
  };

  $computed(this, 'sum', [
    function() { return this.nested.num; },
    function() { return local; },
    computeFunc]);
```

Guessing variable names from function signature, like Angular does in its DI, is not supported here. It would not work after minification and could create ugly bugs in your code.

### Dependency chain

You can add computed properties that are dependent on other computed properties. In fact, this is where **$computed** really starts to shine with its performance benefits.

```js
app.controller('AppCtrl', ['$computed', function($computed) {
  // Input variables
  this.a = 15;
  this.b = 32;

  // Computed property
  $computed(this, 'sum', ['a', 'b', function(a, b) {
    return a + b;
  }]);

  // Other computed property
  $computed(this, 'sumPow', ['sum', function(sum) {
    return Math.pow(sum, 2);
  }]);
}]);
```

## Contributing

1. Fork it (https://github.com/karolsluszniak/angular-computed/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
