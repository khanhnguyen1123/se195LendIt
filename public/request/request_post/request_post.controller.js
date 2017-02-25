(function() { 

   angular
      .module('meanApp')
      .controller('requestPostController', requestPostController);

   requestPostController.$inject = ['$location','$http','$scope','$state','filepickerService','meanData','authentication'];

   function requestPostController ($location, $http, $scope, $state, filepickerService, meanData, authentication) {
      const c_state = 'Request Post Controller';
      //console.log('State: ' + c_state);
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.requestPost = {};
      $scope.requestPost.category = $scope.categories[0];
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

      $scope.createRequestPost = function() {
         $scope.requestPost.ownerId = $scope.pr.user._id;
         $scope.requestPost.ownerName = $scope.pr.user.name;
         
         $http.post('/api/requestedItem/post', $scope.requestPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               $scope.requestPost = {};
               $state.go('request');
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
            maxFiles: 10,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.requestPost.pictures = data;
            $scope.$apply();
            document.getElementById("images").style.display = "block";
            document.getElementById("form").style.width = "calc(100% - 475px)";
            document.getElementById("textarea").style.height = "200px";
         });
      };
   }

})();