(function() { 
  angular
    .module('meanApp')
    .controller('postRequestedItemController', postRequestedItemController);
 	postRequestedItemController.$inject = ['$location','$http','$scope','filepickerService','meanData'];
    function postRequestedItemController ($location,$http,$scope,filepickerService,meanData) {
      console.log('inside postRequestedItemController ');
   //   $scope.vm.user = authentication.currentUser();
    //  $scope.vm.user = authentication.currentUser;
      $scope.pr = this;
      $scope.pr.user = {};
      meanData.getProfile()
        .success(function(data) {
          $scope.pr.user = data;
          //console.log('khanh print out data in updateProfileImageController '+data.email+ "  id"+data._id);
        })
        .error(function (e) {
          console.log(e);
        });    

      $scope.postedItem = {};
            
       // save image into mongodb server 
      $scope.createRequestedItem = function(){
        console.log($scope.pr.user.email);
        $scope.postedItem.ownerId = $scope.pr.user._id;
        $http.post('/api/requestedItem/post', $scope.postedItem)
          .success(function(data){
            console.log(JSON.stringify(data));   
            //Clean the form to allow the user to create new post   
            $scope.postedItem = {};                
          })
          .error(function(error) {
                    console.log('Error: ' + error);
                });
      };  

      //Single file upload, you can take a look at the options
      $scope.upload = function(){
        filepickerService.pick(
                {
            mimetype: 'image/*',
            language: 'en',
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
          },
                function(Blob){
            console.log(JSON.stringify(Blob));
            $scope.postedItem.picture = Blob;
            $scope.$apply();
          }
            );
      };
      //Multiple files upload set to 3 as max number
      $scope.uploadMultiple = function(){
        filepickerService.pickMultiple(
                {
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 3,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
          },
                function(Blob){
            console.log(JSON.stringify(Blob));
            $scope.postedItem.morePictures = Blob;
            $scope.$apply();
          }
            );
      };  




      } // end updateProfileImageController

})();