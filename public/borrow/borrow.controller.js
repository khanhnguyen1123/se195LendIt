(function() { 
   angular
      .module('meanApp')
      .controller('borrowController', borrowController);
   borrowController.$inject = ['$location','$http','$scope','authentication', '$stateParams', '$state'];

   function borrowController ($location, $http, $scope, authentication, $stateParams, $state) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.sortOptions = [
         {
            'display' : 'Most Recent',
            'value' : 'date/'
         },
         {
            'display' : 'Alphabetically',
            'value' : 'name/'
         },
         {
            'display' : 'Rating',
            'value' : 'rate/'
         }
      ];
      let baseLink = '/api/borrow/';

      $scope.selectedSort = $scope.sortOptions[0];
      $scope.selectedCategory = $scope.categories[0];
      $scope.borrowItems = [];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();
      $scope.page = {
         'current' : 1,
         'max' : 3
      };
      if ($stateParams.page && $stateParams.page > 0) {
         $scope.page.current = parseInt($stateParams.page);
      }
      countItems();
      getItems();

      
      //Fixes UI on Page Change
      function countItems() {
         let temp = "/api/borrow/get/count";
         if ($scope.selectedCategory != $scope.categories[0])
            temp = temp + "/" + $scope.selectedCategory
         $http.get(temp)
            .success ( function(data) {
               //$scope.page.max = Math.ceil(parseInt(data)/25);
               console.log($scope.page.max);
            })
            .error ( function(err) {
               console.log(err)
            });
      }
      //Get Borrow Items
      function getItems (link) {
         if (link == null) {
            link = baseLink + "get/" + $scope.selectedSort.value + $scope.page.current;
            if ($scope.selectedCategory != $scope.categories[0])
               link = baseLink + "category/" + $scope.selectedCategory + "/" +$scope.selectedSort.value + $scope.page.current;
         }
         console.log(link);
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
         if ($scope.selectedCategory != category) {
            $scope.page.current = 1;
            $scope.selectedCategory = category;
            if (category == $scope.categories[0])
               getItems( baseLink + "get/" + $scope.selectedSort.value + $scope.page.current);
            else
            getItems( baseLink + "category/" + category + "/" + $scope.selectedSort.value + $scope.page.current);
         }
      }
      //Sorts Items
      $scope.sort = function(option) {
         if (option != $scope.selectedSort) {
            $scope.page.current = 1;
            $scope.selectedSort = option;
            getItems();
         }
      }
      $scope.update = function() {
         
         if ($scope.page.next == null || $scope.page.next == $scope.page.current)
            return;
         $scope.page.current = $scope.page.next;
         $scope.page.next = null;
         countItems();
         getItems();
      }

   }
})();