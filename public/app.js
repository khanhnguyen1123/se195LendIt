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
        url: '/publicProfile/:random',
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
      .state('detail',{
        url: '/detail/:random',
        templateUrl: 'public/detail/detail.view.html',
        controller: 'detailController'
      })
      .state('lending',{
        url: '/lending',
        templateUrl: 'public/lending/lending.view.html',
        controller: 'lendingController'
      })
      .state('lendingItemdetail',{
        url: '/lendingItemdetail/:random',
        templateUrl: 'public/detailLendingItem/lendingItemDetail.view.html',
        controller: 'lendingItemDetailController'
      })
      .state('LendingCategory',{
        url: '/lendingCategory/:fixedCategory',
        templateUrl: 'public/lendingCategoryDetail/CategoryDetail.view.html',
        controller: 'lendingCategoryController'
      })
      .state('requestingCategory',{
        url: '/requestingCategory/:fixedCategory',
        templateUrl: 'public/requestingCategoryDetail/CategoryDetail.view.html',
        controller: 'requestingCategoryController'
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
      console.log("khanh before running to check for authentication in /profile  ");
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        console.log("khanh after running to check for authentication in /profile  ");
        $location.path('/');
      }


    });


    $state.go('detail');
    $state.go('lendingItemdetail');
    $state.go('publicProfile');
    $state.go('login');
    console.log('kkkkkkkkkkkkkkkkk run 1');
    $state.go('request');
    console.log('kkkkkkkkkkkkkkkkk run 2');
    $state.go('lending');
    console.log('kkkkkkkkkkkkkkkkk run 3');
    $state.go('profile');
    console.log('kkkkkkkkkkkkkkkkk run 4');
    $state.go('home');


  }
  
  angular
    .module('meanApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider','filepickerProvider', config])
    .run(['$rootScope', '$location', 'authentication','$state', run]);

})();