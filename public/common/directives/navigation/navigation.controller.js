(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);
  navigationCtrl.$inject = ['$location','authentication','$interval','$http', 'meanData'];

  function navigationCtrl($location, authentication,$interval,$http, meanData) {
    var vm = this;
    vm.isLoggedIn = authentication.isLoggedIn();
    
    vm.newMessages = 0;
    vm.currentUser;

    
    //User Logout
    vm.logout = function(){
    	authentication.logout();
    	// try to fix bug: call vm.isloggedin again to clear bug of pressing logout
      vm.isLoggedIn = authentication.isLoggedIn();
      $location.path('/');
    };

    if (authentication.isLoggedIn()) {
      meanData.getProfile()
        .success(function(data) {
          vm.currentUser = data;
        })
        .error(function (e) {
          console.log(e);
        })
        .finally( function() {
          getNew();
        })
    }

    function getNew() {
      if (!vm.currentUser)
        return;
      $http.get('/api/message/getNew/'+vm.currentUser._id)
        .success( function(data) {
          vm.newMessages = data;
        })
        .error (function(error) {
          console.log(error);
        });
    }
    //Checks New Message Count every 5 Secs
    $interval( function() { getNew() }, 5000);

  }
})();
