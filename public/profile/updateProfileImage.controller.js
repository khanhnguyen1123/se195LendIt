(function() { 
  angular
    .module('meanApp')
    .controller('updateProfileImageController', updateProfileImageController);
 	updateProfileImageController.$inject = ['$location','$http','$scope','filepickerService','meanData'];
    function updateProfileImageController ($location,$http,$scope,filepickerService,meanData) {
      console.log('inside updateProfileImageController ');
   //   $scope.vm.user = authentication.currentUser();
    //  $scope.vm.user = authentication.currentUser;
      $scope.vmk = this;
      $scope.vmk.user = {};
      meanData.getProfile()
        .success(function(data) {
          $scope.vmk.user = data;
          console.log('khanh print out data in updateProfileImageController'+data.email+ "  id"+data._id);
        })
        .error(function (e) {
          console.log(e);
        });      
       // save image into mongodb server 
      $scope.submitUpdateProfileImage = function(){
        console.log($scope.vmk.user.email);
        $http.post('/api/profile/editPhoto', $scope.vmk.user)
          .success(function(data){
            console.log(JSON.stringify(data));                      
          })
          .error(function(data) {
                    console.log('Error: ' + data);
                });
      };  

      // calling filestack api to choose profile images
      $scope.editProfileImage = function(){
        filepickerService.pick(
            {
              mimetype: 'image/*',
              language: 'en',
              services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
              openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
              console.log(JSON.stringify(Blob));
              $scope.vmk.user.profileImage = Blob;
          //    $scope.$apply();
              
              $scope.submitUpdateProfileImage();
            }
        );
      };  




      } // end updateProfileImageController

})();