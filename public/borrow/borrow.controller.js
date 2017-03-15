(function() { 
   angular
      .module('meanApp')
      .controller('borrowController', borrowController);
   borrowController.$inject = ['$location','$http','$scope','authentication', '$stateParams', '$state'];

   function borrowController ($location, $http, $scope, authentication, $stateParams, $state) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.sortOptions = ['Most Recent', 'Alphabetically', 'Rating'];
      let sortLinks = ['date/', 'name/', 'rate/'];
      let baseLink = '/api/borrow/';

      $scope.selectedSort = $scope.sortOptions[0];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();
      $scope.page = {
         'current' : 1,
         'max' : 11
      };
      if ($stateParams.page && $stateParams.page > 0) {
         $scope.page.current = parseInt($stateParams.page);
      }

      //Fixes UI on Page Change
      $http.get('/api/borrow/get/count')
         .success ( function(data) {
            //$scope.page.max = Math.ceil(parseInt(data)/25);
         })
         .error ( function(err) {
            console.log(err)
         });
      getItems(baseLink+"get/date/"+$scope.page.current)

      //Get Borrow Items
      function getItems (link) {
         $http.get(link)
            .success( function(data) {
               $scope.displayedItems = data;
            })
            .error ( function(error) {
               console.log('Error: ' + error);
            });
      };
      //Filters By Category
      $scope.filter = function(category) {
         //Update Selected Category
         $scope.selectedCategory = category;
         let sort = sortLinks[0];
         if ($scope.selectedSort == $scope.sortOptions[1])
            sort = sortLinks[1];
         else if ($scope.selectedSort == $scope.sortOptions[2])
            sort = sortLinks[2];

         if (category == $scope.categories[0]) {
            getItems( baseLink + "get/" + sort + $scope.page.current);
            return;
         }
         getItems( baseLink + "category/" + category + "/" + sort + $scope.page.current);
      }
      //Sorts Items
      $scope.sort = function(option) {
         $scope.selectedSort = option;
         $scope.filter($scope.selectedCategory);
      }
   }
})();