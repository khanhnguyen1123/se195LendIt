(function() { 

   angular
      .module('meanApp')
      .controller('rentPostController', rentPostController);

   rentPostController.$inject = ['$location','$http','$scope', '$state','filepickerService','meanData', 'authentication'];

   function rentPostController ($location, $http, $scope, $state,filepickerService, meanData, authentication) {
      const c_state = 'Rent Post Controller';
      //console.log('State: ' + c_state);
      $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.priceOptions = ['per hour', 'per day', 'per week'];
      $scope.rentPost = {};
      $scope.rentPost.category = $scope.categories[0];
      $scope.rentPost.priceOption = $scope.priceOptions[0];
      $scope.pr = this;
      $scope.pr.user = {};
      document.getElementById("images").style.display = "none";
      var geocoder = new google.maps.Geocoder();
      
      if(!authentication.isLoggedIn())
         $state.go("login");
      else {
         meanData.getProfile()
         .success(function(data) {
            $scope.pr.user = data;
         })
         .error(function (e) {
            console.log(e);
         }); 
      }

      $scope.createRentPost = function() {
         $scope.rentPost.ownerId = $scope.pr.user._id;
         $scope.rentPost.ownerName = $scope.pr.user.name;
         $scope.rentPost.state = "Available";
         $scope.rentPost.location = {};
         getLatLng($scope.location, function(result){
            var location = JSON.parse(result);
            console.log(result);
            var tmp = result.split(/[:,{}]+/);
            var lat = Math.round(parseFloat(tmp[2]) * 1000) / 1000;
            var lng = Math.round(parseFloat(tmp[4]) * 1000) / 1000;
            $scope.rentPost.location.lat = lat;
            $scope.rentPost.location.lng = lng;
            $http.post('/api/lendingItem/post', $scope.rentPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               //Clean the form to allow the user to create new post   
               $scope.rentPost = {};
               $state.go("rent")
               document.getElementById("images").style.display = "none";
               document.getElementById("form").style.width = "calc(100% - 40px)";                 
            })
            .error(function(error) {
               console.log('Error: ' + error);
            });
         });
      };

      $scope.upload = function() {
         filepickerService.pickMultiple({
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 5,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.rentPost.pictures = data;
            $scope.$apply();
            document.getElementById("images").style.display = "block";
            document.getElementById("form").style.width = "calc(100% - 475px)";
            document.getElementById("textarea").style.height = "200px";
         });
      };

      function getLatLng(address, callback){
         geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == 'OK') {
               // console.log(JSON.stringify(results[0].geometry.location));
               callback(JSON.stringify(results[0].geometry.location));
               // callback(results[0].geometry.location);
            } else {
               console.log('Geocode was not successful for the following reason: ' + status);
            }
         });
      }
   }

})();