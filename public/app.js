(function () {

  angular.module('meanApp', ['ui.router','angular-filepicker']);

  function config ($stateProvider, $urlRouterProvider, $locationProvider,filepickerProvider) {
    
    $urlRouterProvider.otherwise('/');
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
      .state('publicProfile',{
        url: '/profile/:random',
        templateUrl: 'public/publicProfile/publicProfile.view.html',
        controller: 'publicProfileController'
      })
      .state('fbredirect',{
        url: '/fbredirect',
        templateUrl: 'public/fbpage/fb.view.html',
        controller: 'fbcontroller'
      })
      .state('request',{
        url: '/request',
        templateUrl: 'public/request/request.view.html',
        controller: 'requestController'
      })
      .state('requestmap',{
        url: '/request/requestmap',
        templateUrl: 'public/request/map/requestmap.view.html',
        controller: 'requestMapController'
      })
      .state('request_post', {
        url: '/request/post',
        templateUrl: 'public/request/request_post/request_post.view.html',
        controller: 'requestPostController'
      })
      .state('request_item',{
        url: '/request/:random',
        templateUrl: 'public/request/request_item/request_item.view.html',
        controller: 'requestItemController'
      })
      .state('rent',{
        url: '/rent',
        templateUrl: 'public/rent/rent.view.html',
        controller: 'rentController'
      })
      .state('rentmap',{
        url: '/rent/rentmap',
        templateUrl: 'public/rent/map/rentmap.view.html',
        controller: 'rentmapController'
      })
      .state('rent_post', {
        url: '/rent/post',
        templateUrl: 'public/rent/rent_post/rent_post.view.html',
        controller: 'rentPostController'
      })
      .state('rent_item', {
        url: '/rent/:random',
        templateUrl: 'public/rent/rent_item/rent_item.view.html',
        controller: 'rentItemController'
      })
      .state('myItem', {
        url: '/myItem',
        templateUrl: 'public/myItem/myItem.view.html',
        controller: 'myItemController'
      })

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    //Add the API key to use filestack service
    filepickerProvider.setKey('ApAG1hn5GRCymw8vG9TUYz');
  }

  function run($rootScope, $location, authentication,$state) {
    $rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
      //console.log("khanh before running to check for authentication in /profile  ");
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        //console.log("khanh after running to check for authentication in /profile  ");
        $location.path('/');
      }


    });

  }
  
  angular
    .module('meanApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider','filepickerProvider', config])
    .run(['$rootScope', '$location', 'authentication','$state', run]);

})();