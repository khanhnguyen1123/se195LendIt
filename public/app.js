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
      .state('borrow',{
        url: '/borrow',
        templateUrl: 'public/borrow/borrow.view.html',
        controller: 'borrowController'
      })
      .state('borrow_page',{
        url: '/borrow/page/:page',
        templateUrl: 'public/borrow/borrow.view.html',
        controller: 'borrowController'
      })
      .state('borrow_post', {
        url: '/borrow/post',
        templateUrl: 'public/borrow/borrow_post/borrow_post.view.html',
        controller: 'borrowPostController'
      })
      .state('borrowmap', {
        url: '/borrow/map',
        templateUrl: 'public/borrow/map/borrowmap.view.html',
        controller: 'borrowmapController'
      })
      .state('borrow_item', {
        url: '/borrow/:random',
        templateUrl: 'public/borrow/borrow_item/borrow_item.view.html',
        controller: 'borrowItemController'
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
      .state('myItem', {
        url: '/myItem',
        templateUrl: 'public/myItem/myItem.view.html',
        controller: 'myItemController'
      })
      .state('search', {
        url: '/search/:key',
        templateUrl: 'public/search/search.view.html',
        controller: 'searchController'
      })
      .state('message', {
        url: '/message',
        templateUrl: 'public/message/message.view.html',
        controller: 'messageController'
      })
    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    //Add the API key to use filestack service
    filepickerProvider.setKey('AxHaV7fY0SjWcy3oO6Ilmz');
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