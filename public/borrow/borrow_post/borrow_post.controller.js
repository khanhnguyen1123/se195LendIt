(function() { 

   angular
      .module('meanApp')
      .controller('borrowPostController', borrowPostController);

   borrowPostController.$inject = ['$location','$http','$scope', '$state','filepickerService','meanData', 'authentication'];

   function borrowPostController ($location, $http, $scope, $state,filepickerService, meanData, authentication) {
      const c_state = 'Borrow Post Controller';
      //console.log('State: ' + c_state);
      $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.borrowPost = {};
      $scope.borrowPost.category = $scope.categories[0];
      $scope.borrowPost.location = {};
      $scope.pr = this;
      $scope.pr.user = {};
      document.getElementById("images").style.display = "none";
      
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
         $scope.borrowPost.location.lat = Math.round(parseFloat(place.geometry.location.lat()) * 1000) / 1000;
         $scope.borrowPost.location.lng = Math.round(parseFloat(place.geometry.location.lng()) * 1000) / 1000;
         console.log($scope.borrowPost.location.lng + " " + $scope.borrowPost.location.lng);
         refreshMap($scope.borrowPost.location.lat, $scope.borrowPost.location.lng);
         $scope.$apply(); 
      });

      $scope.createItem = function() {
         $scope.borrowPost.ownerId = $scope.pr.user._id;
         $scope.borrowPost.ownerName = $scope.pr.user.name;
         $scope.borrowPost.state = "Available";

         $http.post('/api/borrow/create', $scope.borrowPost)
            .success(function(data){
               console.log(JSON.stringify(data));   
               //Clean the form to allow the user to create new post   
               $scope.borrowPost = {};
               $state.go("borrow");
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
            $scope.borrowPost.pictures = data;
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