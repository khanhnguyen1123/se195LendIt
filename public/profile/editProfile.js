(function() { 
  angular
    .module('meanApp')
    .controller('editProfileController', editProfileController);
 	editProfileController.$inject = ['$location','$http','$scope','meanData','$state'];
    function editProfileController ($location,$http,$scope,meanData,$state) {
      console.log('inside editProfileController ');
   //   $scope.vm.user = authentication.currentUser();
    //  $scope.vm.user = authentication.currentUser;
      $scope.vme = this;
      $scope.vme.user = {};
      meanData.getProfile()
        .success(function(data) {
          $scope.vme.user = data;
          console.log('khanh print out data in editProfileController'+data.email+ "  id"+data._id);
        })
        .error(function (e) {
          console.log(e);
        });      
       // save image into mongodb server 
      $scope.editProfile = function(){
      $http.post('/api/profile/editProfile',$scope.vme.user)
          .success(function(data){
            console.log(JSON.stringify(data));
                
          })
          .error(function(data){
            console.log('error' +data);
          })

       }; 

      



      } // end updateProfileImageController

})();