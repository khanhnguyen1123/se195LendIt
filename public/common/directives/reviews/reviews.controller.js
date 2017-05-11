(function () {

   angular
      .module('meanApp')
      .controller('reviewsCtrl', reviewsCtrl);
   reviewsCtrl.$inject = ['$scope'];

   function reviewsCtrl($scope) {
      if (!$scope.reviews) {
         $scope.reviews = [];
         $scope.message = "No Reviews Found";
      }
   }

})();
