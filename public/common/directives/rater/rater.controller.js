(function () {

   angular
      .module('meanApp')
      .controller('raterCtrl', raterCtrl);
   raterCtrl.$inject = ['$scope'];

   function raterCtrl($scope) {
      $scope.rating = 0;
      let stars = [
         document.getElementById('rater1'),
         document.getElementById('rater2'),
         document.getElementById('rater3'),
         document.getElementById('rater4'),
         document.getElementById('rater5')
      ];

      $scope.update = function(index) {
         $scope.rating = index;
         for (let i = 0; i < 5; i++) {
            if (i < index)
               stars[i].innerHTML = "&#9733;"
            else
               stars[i].innerHTML = "&#9734;"
         }
      }
   }

})();
