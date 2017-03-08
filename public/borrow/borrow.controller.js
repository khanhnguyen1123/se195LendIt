(function() { 
   angular
      .module('meanApp')
      .controller('borrowController', borrowController);
   borrowController.$inject = ['$location','$http','$scope','authentication', '$stateParams'];

   function borrowController ($location, $http, $scope, authentication, $stateParams) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      //$scope.sortOptions = ['Most Recent', 'Alphabetically', 'Price: Low to High', 'Price: High to Low', 'Rating'];
      $scope.sortOptions = ['Date Added', 'Alphabetically', 'Rating'];
      let baseLink = '/api/borrow/';

      $scope.selectedSort = $scope.sortOptions[0];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();

      var page = 1;
      if ($stateParams.page)
         page = $stateParams.page;
      getItems(baseLink+"get/"+page)

      //Get Borrow Items
      function getItems (link) {
         console.log(link);
         $http.get(link)
            .success( function(data) {
               $scope.displayedItems = data;
               console.log(data);
            })
            .error ( function(error) {
               console.log('Error: ' + error);
            });
      };
      //Filters By Category
      $scope.filter = function(category) {
         //Update Selected Category
         $scope.selectedCategory = category;
         let sort = "";
         if ($scope.selectedSort == $scope.sortOptions[1])
            sort = "abc/";
         else if ($scope.selectedSort == $scope.sortOptions[2])
            sort ="rating/";

         if (category == $scope.categories[0]) {
            getItems( baseLink + "get/" + sort + page);
            return;
         }
         getItems( baseLink + "category/" + sort + category + "/" + page);
      }
      //Sorts Items
      $scope.sort = function(option) {
         $scope.selectedSort = option;
         $scope.filter($scope.selectedCategory);
      }
   }
})();