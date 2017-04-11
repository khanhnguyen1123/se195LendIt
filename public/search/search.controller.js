(function() { 
   angular
      .module('meanApp')
      .controller('searchController', searchController);
   searchController.$inject = ['$location', '$http', '$scope', '$window', '$stateParams'];

   function searchController ($location,$http,$scope,$window, $stateParams) {      
      $scope.searchRent = {};
      $scope.searchBorrow = {};
      $scope.searchController = {};
      $scope.displayItems = {};
      $scope.key = $stateParams.key;

      let searchLinks = ['/api/rent/search/', '/api/borrow/search/', '/api/request/search/']

      function getItems(link) {
         $http.get(link)
            .success( function(data) {
               $scope.displayItems = data;
            })
            .error ( function(error) {
               console.log(error);
            })
      }

      $scope.toggle = function(index) {
         let rent = document.getElementById("rent-tab");
         let borrow = document.getElementById("borrow-tab");
         let request = document.getElementById("request-tab");
         rent.classList.remove("tab-active");
         borrow.classList.remove("tab-active");
         request.classList.remove("tab-active");
         if (index == 0) {
            rent.classList.add("tab-active");
            $scope.displayItems = {};
            return;
         } else if (index == 1) {
            borrow.classList.add("tab-active");
         } else {
            request.classList.add("tab-active");
            $scope.displayItems = {};
            return;
         }
         getItems(searchLinks[index]+$stateParams.key);
      }
      $scope.toggle(1);
   }

})();
