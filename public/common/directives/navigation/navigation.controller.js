(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();

    //adding logout
    vm.logout = function(){
    	console.log("khanh logout is pressed ");
    	authentication.logout();
    	$location.path('home');
    };
  }

})();