(function () {

   angular
      .module('meanApp')
      .controller('starsCtrl', starsCtrl);
   starsCtrl.$inject = ['$scope'];

   function starsCtrl($scope) {
      $scope.black = [];
      $scope.white = [];
      
      $scope.update = function () {
         if ($scope.value) {
            $scope.black = [];
            $scope.white = [];
            for (let i=0; i<5; i++) {
               if (i < $scope.value)
                  $scope.black.push(i);
               else
                  $scope.white.push(i);
            }
         }
      }
   }

})();
