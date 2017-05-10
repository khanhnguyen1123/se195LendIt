(function () {

  angular
    .module('meanApp')
    .directive('stars', stars);

  function stars () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/stars/stars.template.html',
      controller: 'starsCtrl',
      scope: true, // creates its own local scope
      link: function(scope, element, attributes) {
        attributes.$observe('value', function(data) {
          if (data) {
            scope.value = data
            scope.update();
          }   
        })
      }
    };
  }

})();