(function () {

  angular.module('meanApp', ['ui.router']);

  function config ($stateProvider, $urlRouterProvider, $locationProvider) {
    
  //  $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'public/home/home.view.html',
        controller: 'homeCtrl'
        
      })
      .state('register', {
        url: '/register',
        templateUrl: 'public/auth/register/register.view.html',
        controller: 'registerCtrl'
        
      })
      .state('login', {
        url: '/login',
        templateUrl: 'public/auth/login/login.view.html',
        controller: 'loginCtrl'
      
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'public/profile/profile.view.html',
        controller: 'profileCtrl'
     
      })
      .state('fbredirect',{
        url: '/fbredirect',
        templateUrl: 'public/fbpage/fb.view.html',
        controller: 'fbcontroller'
      })
      

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
      console.log("khanh before running to check for authentication in /profile  ");
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        console.log("khanh after running to check for authentication in /profile  ");
        $location.path('/');
      }
    });
  }
  
  angular
    .module('meanApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();