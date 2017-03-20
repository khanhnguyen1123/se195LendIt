(function() { 
   angular
      .module('meanApp')
      .controller('searchController', searchController);
   searchController.$inject = ['$location', '$http', '$scope', '$window', '$stateParams'];

   function searchController ($location,$http,$scope,$window, $stateParams) {      
      $scope.displayItems = {};
      $scope.key = $stateParams.key;
      $scope.tabs = ['', '', ''];
      $scope.message = "";

      let searchLinks = ['/api/rent/search/', '/api/borrow/search/', '/api/request/search/']

      function getItems(link) {
         $http.get(link)
            .success( function(data) {
               $scope.displayItems = data;
            })
            .error ( function(error) {
               console.log(error);
            })
            .then ( function () {
               if ($scope.displayItems.length == 0)
                  $scope.message = "No Items Found";
               else
                  $scope.message = "";
            });
      }

      $scope.toggle = function(index) {
         $scope.tabs = ['', '', ''];
         $scope.tabs[index] = "tab-active";
         $scope.displayItems = {};
         getItems(searchLinks[index]+$stateParams.key);
      }
      $scope.toggle(0);
   }

})();
