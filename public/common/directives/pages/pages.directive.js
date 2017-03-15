(function () {

  angular
    .module('meanApp')
    .directive('pages', pages);

  function pages () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/pages/pages.template.html',
      controller: 'pagesCtrl',
      scope: true,
      link: function(scope, element, attributes) {
        attributes.$observe('current', function(data) {
          if (data)
            scope.current = parseInt(data);
          scope.update();
        })
        attributes.$observe('max', function(data) {
          if (data)
            scope.max = parseInt(data);
          scope.update();
        })
        attributes.$observe('state', function(data) {
          if (data)
            scope.state = data;
          scope.update();
        })
      }
    };
  }

})();