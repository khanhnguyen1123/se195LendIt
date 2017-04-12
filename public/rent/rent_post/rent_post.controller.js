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
      $scope.rentPost.location = {};
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

      initMap();
      var inputFrom = document.getElementById('from');
      var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
         var place = autocompleteFrom.getPlace();
         $scope.rentPost.location.lat = Math.round(parseFloat(place.geometry.location.lat()) * 1000) / 1000;
         $scope.rentPost.location.lng = Math.round(parseFloat(place.geometry.location.lng()) * 1000) / 1000;
         console.log($scope.rentPost.location.lng + " " + $scope.rentPost.location.lng);
         refreshMap($scope.rentPost.location.lat, $scope.rentPost.location.lng);
         $scope.$apply(); 
      });

      $scope.createRentPost = function() {
         $scope.rentPost.ownerId = $scope.pr.user._id;
         $scope.rentPost.ownerName = $scope.pr.user.name;
         $scope.rentPost.state = "Available";

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

      ///Google map view
      function initMap(){

         var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(37.33, -121.88),
            mapTypeId: google.maps.MapTypeId.ROADMAP
         }

         $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }

      function refreshMap(lat, lng){

         var location =  new google.maps.LatLng(lat, lng);
         $scope.map.setCenter(location);
         $scope.map.setZoom(15);
         console.log(lat + " " + lng);

         var marker = new google.maps.Marker({
            map: $scope.map,
            position: location
         });
         console.log(JSON.stringify(marker.position));

         google.maps.event.addListener(marker, 'click', function(){
               infoWindow.open($scope.map, marker);
            }); 
      }
   }

})();