# angular-computed

[![Bower version](https://img.shields.io/bower/v/angular-computed.svg?style=flat-square)](http://bower.io/)

Computed properties allow to produce efficient and elegant properties that are a result of some calculation dependent on other properties. With **$computed** you get an easy way to define them using pattern similar to Angular's Dependency Injection. Here are some advantages:

- property computation is executed just once after input change
- property computation is executed just once even if property is used in multiple places
- property computation can make use of promises (e.g. compute property via API call)
- views are simplified with `{{ prop }}` instead of `{{ computeProp() }}`
- computed properties are visually separated in controller code
- definition syntax is consistent with core Angular concepts

Internally, **$computed** is very simple and mostly based on Angular's `$watch`. It's just a tiny, clean pattern implementation.

## Usage

First off, add **angular-computed.js** file to your project. You can download it from [here](https://raw.githubusercontent.com/karolsluszniak/angular-computed/master/angular-computed.js) or require bower `angular-computed` package.

Then, add `cloudless.computed` as your app's dependency:

```js
var app = angular.module('app', ['cloudless.computed']);
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

$computed(this, 'sum', [
  function() { return this.nested.num; },
  function() { return local; },
  computeFunc]);
```

Guessing dependencies from function signature, like Angular's DI, is not supported. It would not work after minification and could create ugly bugs in your code.

### Computing the property

Compute function gets called when any of its dependencies change. It takes all dependencies as arguments and should return new property value:

```js
$computed(scope, 'descriptionIsLong', ['description', function(description) {
  return (description.length > 100);
}]);
```

You can also return a promise from your compute function. This, for instance, makes it possible to use AJAX calls to compute your properties:

```js
$computed(scope, 'userName', ['userId', function(userId) {
  return $http.get('/users/' + userId).then(function(response) {
    return response.data.firstName + ' ' + response.data.lastName;
  });
}]);
```

**$computed** protects your async properties against race conditions. If input changes again before previous promise was resolved, the value returned by that previous promise will never get assigned to the property anymore.

Your `then()` callbacks will still execute, but there's a way to avoid it - by using a special `$valid` function injected for your convenience by **$computed**:

```js
$computed(scope, 'userName', ['userId', function(userId, $valid) {
  return $http.get('/users/' + userId).then(function(response) {
    if ($valid()) {
      // imagine here a code you don't want to process for old promises
      scope.userChangeCount += 1;
    }

    return response.data.firstName + ' ' + response.data.lastName;
  });
}]);
```

### Dependency chain

You can add computed properties that are dependent on other computed properties. In fact, this is where the pattern implemented by **$computed** really starts to shine with its performance benefits.

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

Imagine something like this happens later in controller lifecycle:

```js
this.a = this.a + 1;
this.b = this.b - 1;
```

The `sum` property will be recomputed due to input change but its result will not change and thus the `sumPow` property will not have to be recomputed. Neat, isn't it?

### Manual recalculation

You may wish to recompute previously defined property on demand, even if none of its dependencies have changed. You can do so like this:

```js
$computed(this, 'prop').touch();
```

You could even define a computed property without dependencies and have it computed automatically only once, on scope initialization, and recompute it on demand afterwards. This is not a primary application of **$computed**, but this behavior may prove useful at some point.

## Contributing

1. Fork it (https://github.com/karolsluszniak/angular-computed/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
