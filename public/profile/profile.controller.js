(function() {

   angular
      .module('meanApp')
      .controller('profileCtrl', profileCtrl);
   profileCtrl.$inject = ['$scope', '$location', 'meanData', '$http', 'authentication', '$state', 'filepickerService'];
   
   function profileCtrl($scope,$location, meanData,$http,authentication, $state, filepickerService) {
      $scope.user = {};
      if (!authentication.isLoggedIn()) {
         $state.go("login");
      } else {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
               console.log('Profile Controller: ' + data.email);
            })
            .error(function (e) {
               console.log(e);
            });
      }
      $scope.reload = function(){
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
               console.log('Profile Controller: ' + data.email);
            })
            .error(function (e) {
               console.log(e);
            });
      };
      $scope.uploadUserPhoto = function () {
         filepickerService.pick({
            mimetype: 'image/*',
            language: 'en',
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         },
            function(data){
            console.log(JSON.stringify(data));
            $scope.user.profileImage = data;
            $scope.updateUserPhoto();
         });
      };
      $scope.updateUserPhoto = function () {
         console.log("Upload Profile Picture");
         $http.post('/api/profile/updateUserPhoto', $scope.user)
            .success(function(data){
               console.log(JSON.stringify(data));                      
            })
            .error(function(data) {
               console.log('Error: ' + data);
            });
      };
      $scope.updateUser = function () {
         $http.post('/api/profile/updateUser', $scope.user)
            .success(function(data){
               console.log(JSON.stringify(data));
            })
            .error(function(data){
               console.log('Profile Controller Error on Updating User');
               console.log(data);
            })
      };
   }
})();