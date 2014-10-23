/*jslint browser: true, devel: true */ /*globals _, angular */
var p = console.log.bind(console);

function parseSV(text) {
  /** Parse some very simple .csv / .tsv into objects */
  var lines = text.split('\n');
  var FS = (lines[0].split('\t').length > lines[0].split(',').length) ? '\t' : ',';
  var columns = lines[0].split(FS);
  return lines.slice(1).filter(function(line) {
    return line !== '';
  }).map(function(row) {
    var cells = row.split(FS);
    return _.object(columns, cells);
  });
}

var app = angular.module('app', [
  'ngStorage',
  'ui.router',
  'misc-js/angular-plugins',
]);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/print');

  $stateProvider
  .state('data', {
    url: '/data',
    templateUrl: 'templates/data.html',
    controller: 'mailmergeCtrl',
  })
  .state('design', {
    url: '/design',
    templateUrl: 'templates/design.html',
    controller: 'mailmergeCtrl',
  })
  .state('print', {
    url: '/print',
    templateUrl: 'templates/print.html',
    controller: 'mailmergeCtrl',
  });
});

app.controller('mailmergeCtrl', function($scope, $localStorage) {
  $scope.$storage = $localStorage;
  $scope.$watch('$storage.csv', function(text) {
    $scope.data = parseSV(text);
  });
});

app.directive('template', function($compile) {
  return {
    restrict: 'A',
    scope: {
      template: '=',
      context: '=',
    },
    link: function(scope, el, attrs) {
      scope.$watch('template', function() {
        el.html(scope.template);
        $compile(el.contents())(scope);
      });
      scope.$watch('context', function() {
        _.extend(scope, scope.context);
        $compile(el.contents())(scope);
      });
    },
  };
});
