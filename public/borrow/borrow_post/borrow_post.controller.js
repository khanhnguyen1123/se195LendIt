(function() { 

   angular
      .module('meanApp')
      .controller('borrowPostController', borrowPostController);

   borrowPostController.$inject = ['$location','$http','$scope', '$state','filepickerService','meanData', 'authentication'];

   function borrowPostController ($location, $http, $scope, $state,filepickerService, meanData, authentication) {
      const c_state = 'Borrow Post Controller';
      //console.log('State: ' + c_state);
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.borrowPost = {};
      $scope.borrowPost.category = $scope.categories[0];
      $scope.pr = this;
      $scope.pr.user = {};
      document.getElementById("images").style.display = "none";
      
      if(!authentication.isLoggedIn())
         $state.go("login");
      else {
         meanData.getProfile()
         .success(function(data) {
            $scope.pr.user = data;
         })
         .error(function (e) {
            console.log(e);
         }); 
      }

      $scope.createBorrowPost = function() {
         $scope.borrowPost.ownerId = $scope.pr.user._id;
         $scope.borrowPost.ownerName = $scope.pr.user.name;
         $scope.borrowPost.state = "Available";
         $http.post('/api/lendingItem/post', $scope.borrowPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               //Clean the form to allow the user to create new post   
               $scope.borrowPost = {};
               $state.go("borrow")
               document.getElementById("images").style.display = "none";
               document.getElementById("form").style.width = "calc(100% - 40px)";                 
            })
            .error(function(error) {
               console.log('Error: ' + error);
            });
      };

      $scope.upload = function() {
         filepickerService.pickMultiple({
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 5,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.borrowPost.pictures = data;
            $scope.$apply();
            document.getElementById("images").style.display = "block";
            document.getElementById("form").style.width = "calc(100% - 475px)";
            document.getElementById("textarea").style.height = "200px";
         });
      };
   }

})();