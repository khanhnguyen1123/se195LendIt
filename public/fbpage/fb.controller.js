(function() { 
  angular
    .module('meanApp')
    .controller('fbcontroller', fbcontroller);
 	fbcontroller.$inject = ['$location','authentication','$http','$scope','$window'];
    function fbcontroller ($location,authentication,$http,$scope,$window) {
      console.log('fbredirectlogin controller is running');
      
      $scope.user = this;
      $scope.user.credentials = $http.post('/api/user/fbRedirectLogin').success(function(data){
      	authentication.saveToken(data.token);
      	console.log('khanh login user in fbcontroller :'+data.token);
      	var token = data.token;
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        console.log(payload+'  k h anh email '+payload.email+ ' k h anh name '+payload.name + " user id:"+payload._id);

        $location.path('profile');
      })
    }

})();