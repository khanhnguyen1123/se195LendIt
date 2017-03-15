(function () {

  angular
    .module('meanApp')
    .directive('reviews', reviews);

  function reviews () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/reviews/reviews.template.html',
      controller: 'reviewsCtrl',
      scope: true, // creates its own local scope
      link: function(scope, element, attributes) {
        attributes.$observe('data', function(data) {
          if (!data) {
            scope.reviews = [];
            scope.message = "No Reviews Found";
          } else {
            scope.reviews = angular.fromJson(data);
            scope.message = "";
          }
        })
      }
    };
  }

})();