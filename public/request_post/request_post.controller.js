(function() { 

   angular
      .module('meanApp')
      .controller('requestPostController', requestPostController);

   requestPostController.$inject = ['$location','$http','$scope','$state','filepickerService','meanData'];

   function requestPostController ($location, $http, $scope, $state, filepickerService, meanData) {
      const c_state = 'Request Post Controller';
      console.log('State: ' + c_state);

      $scope.categories = ['Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];

      $scope.requestPost = {};
      $scope.pr = this;
      $scope.pr.user = {};

      meanData.getProfile()
         .success(function(data) {
            $scope.pr.user = data;
            console.log('khanh print out data in updateProfileImageController'+data.email+ "  id"+data._id);
         })
         .error(function (e) {
            console.log(e);
         }); 

      $scope.createRequestPost = function() {
         $scope.message = "Create Request Successful";
         
         $scope.requestPost.ownerId = $scope.pr.user._id;
         
         $http.post('/api/requestedItem/post', $scope.requestPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               //Clean the form to allow the user to create new post   
               $scope.requestPost = {};
               //$state.go('request');
               document.getElementById("image").style.display = "none";
               document.getElementById("more_images").style.display = "none";
               document.getElementById("form").style.width = "calc(100% - 40px)";
            })
            .error(function(error) {
               console.log('Error: ' + error);
            });
      };

      //Single file upload, you can take a look at the options
      $scope.upload = function(){
         $scope.message = "Upload Pressed";
         filepickerService.pick({
            mimetype: 'image/*',
            language: 'en',
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.requestPost.picture = data;
            $scope.$apply();
            document.getElementById("image").style.display = "block";
            document.getElementById("form").style.width = "calc(100% - 475px)";
            document.getElementById("textarea").style.height = "130px";
         });
      };

      $scope.uploadMultiple = function() {
         $scope.message = "Upload Multiple Pressed";

         filepickerService.pickMultiple({
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 5,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.requestPost.morePictures = data;
            $scope.$apply();
            document.getElementById("more_images").style.display = "block";
            document.getElementById("textarea").style.height = "200px";
         });
      };
   }

})();