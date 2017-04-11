(function() { 
   angular
      .module('meanApp')
      .controller('borrowController', borrowController);
   borrowController.$inject = ['$location','$http','$scope','authentication'];

   function borrowController ($location, $http, $scope, authentication) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.borrowItems = [];
      $scope.loggedIn = authentication.isLoggedIn();

      //Get Borrow Items, TBD
      $http.get('/api/borrow/get')
         .success( function(data) {
            $scope.borrowItems = data;
            $scope.displayedItems = data;
         })
         .error ( function() {
            console.log('Error: ' + error);
         });

      $scope.filter = function(category) {
         //console.log("Filtered Category: " + category);
         $scope.selectedCategory = category;
         if (category == "All") {
            $scope.displayedItems = $scope.borrowItems;
            return;
         }
         $scope.displayedItems = [];
         for (let i = 0; i < $scope.borrowItems.length; i++) { 
            let item = $scope.borrowItems[i];
            if (item.category == category)
               $scope.displayedItems.push(item);
         }
      } 
   }
})();