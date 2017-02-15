(function() { 
  angular
    .module('meanApp')
    .controller('lendingController', lendingController);
 	lendingController.$inject = ['$location','$http','$scope'];

    function lendingController ($location,$http,$scope) {
      //console.log('khanh is inside lendingController');

      $scope.categories = ['All', 'Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
      $scope.selectedCategory = $scope.categories[0];
      $scope.requestedItems = [];
      $scope.lendingItems = [];

      //Retrieve all the requested items to show the request page
      $http.get('/api/lendingItem/get')
        .success(function(data){
          //console.log(JSON.stringify(data));
          $scope.lendingItems = data;
          $scope.displayedItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });

      $scope.filter = function(category) {
        //console.log("Filtered Category: " + category);
        $scope.selectedCategory = category;

        if (category == "All") {
          $scope.displayedItems = $scope.lendingItems;
          return;
        }

        $scope.displayedItems = [];
        for (let i = 0; i < $scope.lendingItems.length; i++) { 
          let item = $scope.lendingItems[i];
          if (item.category == category)
            $scope.displayedItems.push(item);
        }
      }


      
    }// end requestController

})();