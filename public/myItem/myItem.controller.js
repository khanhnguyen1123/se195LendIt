(function() { 
	angular
	  .module('meanApp')
	  .controller('myItemController', myItemController);
	myItemController.$inject = ['$location','meanData','$http','$scope'];
	
   function myItemController ($location,meanData,$http,$scope) {
      $scope.user;
      $scope.rentItems = [];
      $scope.borrowItems = [];
      $scope.requestedItems = [];
      $scope.usedItems = [];

      $scope.filterDisplay = 'All Items'
      $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}, {'label':'Used', 'selected': true}];

      function getRent() {
         $http.get('/api/rent/user/'+$scope.user._id)
            .success(function(data){
              //console.log("Rent Items");
              //console.log(JSON.stringify(data));
              $scope.rentItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      };

      function getBorrow() {
         $http.get('/api/borrow/user/'+$scope.user._id)
            .success(function(data){
              //console.log("Borrow Items");
              //console.log(JSON.stringify(data));
              $scope.borrowItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      }

      function getRequest() {
         $http.get('/api/request/user/'+$scope.user._id)
            .success(function(data){
              //console.log("Request Items");
              //console.log(JSON.stringify(data));
              $scope.requestedItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      }

      function getUsed() {
         if ($scope.user && $scope.user.currentlyRenting != 'undefined') {
            $scope.usedItems = $scope.user.currentlyRenting;
         }
      }

      function getAll() {
         getRent();
         getBorrow();
         getRequest();
         getUsed();
      }

      function getItems(index) {
         if (index == 0)
            getRent();
         else if (index == 1)
            getBorrow();
         else if (index == 2)
            getRequest();
         else if (index == 3)
            getUsed();
      }

      $scope.filterResults = function(filter) {
         if (filter == 'All') {
            getAll();
            $scope.filterDisplay = 'All Items';
            $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}, {'label':'Used', 'selected': true}];
         }
         else {
            if (filter)
               filter.selected = !filter.selected;
            $scope.filterDisplay = "";
            $scope.rentItems = [];
            $scope.borrowItems = [];
            $scope.requestedItems = [];
            $scope.usedItems = [];
            for (let i=0; i<$scope.filters.length; i++) {
               if ($scope.filters[i].selected) {
                  getItems(i);
                  if ($scope.filterDisplay != "")
                     $scope.filterDisplay = $scope.filterDisplay + ', '
                  $scope.filterDisplay = $scope.filterDisplay + $scope.filters[i].label;
               }
            }
            if ($scope.filterDisplay == "Rent, Borrow, Request, Used" || $scope.filterDisplay == "") {
               $scope.filterDisplay = "All Items"
               $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}, {'label':'Used', 'selected': true}];
               getAll();
            }
         }
      }

      meanData.getProfile()
         .success(function(data) {
            $scope.user = data;
         })
         .error( function(error) {
            console.log(error)
         })
         .finally( function(data) {
            if ($scope.user) {
               getAll();
            }
         })
        
        
      
    }

})();