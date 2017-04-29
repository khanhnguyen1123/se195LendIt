(function() { 
   angular
      .module('meanApp')
      .controller('searchController', searchController);
   searchController.$inject = ['$location', '$http', '$scope', '$window', '$stateParams'];

   function searchController ($location,$http,$scope,$window, $stateParams) {      
      $scope.rentItems = [];
      $scope.borrowItems = [];
      $scope.requestItems = [];
      $scope.key = $stateParams.key;
      $scope.message = "";

      $scope.filterDisplay = 'All Results'
      $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}];


      let searchLinks = ['/api/rent/search/', '/api/borrow/search/', '/api/request/search/']

      function getRent() {
         $http.get('/api/rent/search/'+$scope.key)
            .success( function(data) {
               $scope.rentItems = data;
            })
            .error ( function(error) {
               console.log(error);
            })
            .then ( function () {
               checkResults();
            });
      }

      function getBorrow() {
         $http.get('/api/borrow/search/'+$scope.key)
            .success( function(data) {
               $scope.borrowItems = data;
            })
            .error ( function(error) {
               console.log(error);
            })
            .then ( function () {
               checkResults();
            });
      }

      function getRequest() {
         $http.get('/api/request/search/'+$scope.key)
            .success( function(data) {
               $scope.requestItems = data;
            })
            .error ( function(error) {
               console.log(error);
            })
            .then ( function () {
               checkResults();
            });
      }


      function getAll() {
         getRent();
         getBorrow();
         getRequest();
      }

      function getItems(index) {
         if (index == 0)
            getRent();
         else if (index == 1)
            getBorrow();
         else if (index == 2)
            getRequest();
      }

      function checkResults() {
         if ($scope.rentItems.length == 0 && $scope.borrowItems.length == 0 && $scope.requestItems.length == 0)
            $scope.message = "No Items Found";
         else
            $scope.message = "";
      }

      $scope.filterResults = function(filter) {
         if (filter == 'All') {
            getAll();
            $scope.filterDisplay = 'All Results';
            $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}];
         }
         else {
            if (filter)
               filter.selected = !filter.selected;
            $scope.filterDisplay = "";
            $scope.rentItems = [];
            $scope.borrowItems = [];
            $scope.requestItems = [];
            for (let i=0; i<$scope.filters.length; i++) {
               if ($scope.filters[i].selected) {
                  getItems(i);
                  if ($scope.filterDisplay != "")
                     $scope.filterDisplay = $scope.filterDisplay + ', '
                  $scope.filterDisplay = $scope.filterDisplay + $scope.filters[i].label;
               }
            }
            if ($scope.filterDisplay == "Rent, Borrow, Request" || $scope.filterDisplay == "") {
               $scope.filterDisplay = "All Results"
               $scope.filters = [{'label':'Rent', 'selected': true}, {'label':'Borrow', 'selected': true}, {'label':'Request', 'selected': true}];
               getAll();
            }
         }
      }

      getAll();      
      
   }

})();
