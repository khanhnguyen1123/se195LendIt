(function() { 
   angular
      .module('meanApp')
      .controller('borrowController', borrowController);
   borrowController.$inject = ['$location','$http','$scope','authentication', '$stateParams', '$state'];

   function borrowController ($location, $http, $scope, authentication, $stateParams, $state) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.sortOptions = ['Date Added', 'Alphabetically', 'Rating'];
      let sortLinks = ['date/', 'name/', 'rate/'];
      let baseLink = '/api/borrow/';

      $scope.selectedSort = $scope.sortOptions[0];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();
      $scope.pages = [];



      var page = 1;
      if ($stateParams.page) {
         page = $stateParams.page;
      }
      //Fix UI on Page Change
      $http.get('/api/borrow/get/count')
         .success ( function(data) {
            let temp = Math.ceil(parseInt(data)/25);
            for (let i=1; i < temp+1; i++) {
               $scope.pages.push(i);
            }
         })
         .error ( function(err) {
            console.log(err)
         })
         .then (function () {
            let prev = document.getElementById("previous");
            let next = document.getElementById("next");
            prev.classList.add("disabled");
            next.classList.add("disabled");
            if (page < $scope.pages[$scope.pages.length-1])
               next.classList.remove("disabled");
            if (page == $scope.pages[$scope.pages.length-1])
               previous.classList.remove("disabled");
         });
      getItems(baseLink+"get/date/"+page)

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
            getItems( baseLink + "get/" + sort + page);
            return;
         }
         getItems( baseLink + "category/" + category + "/" + sort + page);
      }
      //Sorts Items
      $scope.sort = function(option) {
         $scope.selectedSort = option;
         $scope.filter($scope.selectedCategory);
      }
      $scope.next = function() {
         if (document.getElementById("next").classList.contains("disabled"))
            return;
         let next = parseInt(page)+1;
         $state.go("borrow_page", { "page" : next});
      }
      $scope.previous = function() {
         if (document.getElementById("previous").classList.contains("disabled"))
            return;
         let prev = parseInt(page)-1;
         $state.go("borrow_page", { "page" : prev});
      }
   }
})();