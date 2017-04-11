(function() { 

   angular
      .module('meanApp')
      .controller('requestPostController', requestPostController);

   requestPostController.$inject = ['$location','$http','$scope','$state','filepickerService','meanData','authentication'];

   function requestPostController ($location, $http, $scope, $state, filepickerService, meanData, authentication) {
      const c_state = 'Request Post Controller';
      //console.log('State: ' + c_state);
      $scope.categories = ['Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
      $scope.requestPost = {};
      $scope.requestPost.category = $scope.categories[0];
      $scope.pr = this;
      $scope.pr.user = {};
      document.getElementById("images").style.display = "none";
      var geocoder = new google.maps.Geocoder();
      var location;
      
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

      $scope.createRequestPost = function() {
         $scope.requestPost.ownerId = $scope.pr.user._id;
         $scope.requestPost.ownerName = $scope.pr.user.name;
         $scope.requestPost.location = {};
         $scope.requestPost.location.lat = location.lat();
         $scope.requestPost.location.lng = location.lng();
         $http.post('/api/requestedItem/post', $scope.requestPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               $scope.requestPost = {};
               $state.go('request');
               document.getElementById("images").style.display = "none";
               document.getElementById("form").style.width = "calc(100% - 40px)";
            })
            .error(function(error) {
               console.log('Error: ' + error);
            });
         // getLatLng($scope.location, function(result){
         //    var location = JSON.parse(result);
         //    console.log(result);
         //    var tmp = result.split(/[:,{}]+/);
         //    var lat = Math.round(parseFloat(tmp[2]) * 1000) / 1000;
         //    var lng = Math.round(parseFloat(tmp[4]) * 1000) / 1000;
         //    $scope.requestPost.location.lat = lat;
         //    $scope.requestPost.location.lng = lng;
         
         // $http.post('/api/requestedItem/post', $scope.requestPost)
         //    .success(function(data){
         //       console.log(JSON.stringify(data));   
         //       $scope.requestPost = {};
         //       $state.go('request');
         //       document.getElementById("images").style.display = "none";
         //       document.getElementById("form").style.width = "calc(100% - 40px)";
         //    })
         //    .error(function(error) {
         //       console.log('Error: ' + error);
         //    });
         // });
      };

      $scope.upload = function() {
         filepickerService.pickMultiple({
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 10,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.requestPost.pictures = data;
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


      var autocompleteFrom = new google.maps.places.Autocomplete($scope.location);

      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
         var place = autocompleteFrom.getPlace();
         location = place.geometry.location;
      });
      
   }

})();