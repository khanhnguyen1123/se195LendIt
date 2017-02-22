(function() { 
  angular
    .module('meanApp')
    .controller('requestController', requestController);
 	requestController.$inject = ['$location','$http','$scope', 'authentication'];

    function requestController ($location,$http,$scope, authentication) {
      $scope.categories = ['All', 'Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
      $scope.selectedCategory = $scope.categories[0];
      $scope.requestedItems = [];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();

      //Retrieve all the requested items to show the request page
      $http.get('/api/requestedItem/get')
        .success(function(data){
          //console.log("Requested Items");
          //console.log(JSON.stringify(data));
          $scope.requestedItems = data;
          $scope.displayedItems = data;
        })
        .error(function(error) {
          console.log('Requested Items Error: ' + error);
        });

        $scope.filter = function(category) {
          //console.log("Filtered Category: " + category);
          $scope.selectedCategory = category;

          if (category == "All") {
            $scope.displayedItems = $scope.requestedItems;
            return;
          }

          $scope.displayedItems = [];
          for (let i = 0; i < $scope.requestedItems.length; i++) { 
            let item = $scope.requestedItems[i];
            if (item.category == category)
              $scope.displayedItems.push(item);
          }
        }
      
    }// end requestController

})();