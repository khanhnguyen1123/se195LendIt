//Angular App Module and Controller
(function() { 
	angular
	.module('meanApp')
	.controller('borrowmapController', borrowmapController);
	borrowmapController.$inject = ['$location','$http','$scope','authentication', 'meanData'];
	
	function borrowmapController ($location, $http, $scope, authentication, meanData) {

		$scope.categories = ['All', 'Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
		$scope.selectedCategory = $scope.categories[0];
		$scope.borrowItems = [];
		$scope.displayedItems = [];
		$scope.loggedIn = authentication.isLoggedIn();
		var geocoder = new google.maps.Geocoder();

		$http.get('/api/borrow/getAll')
		.success(function(data){
			console.log(JSON.stringify(data));
			$scope.borrowItems = data;
			$scope.displayedItems = data;
			initMap();
			refreshMap();
		})
		.error(function(error){
			console.log("Error: " + error);
		});

		$scope.filter = function(category) {
			//console.log("Filtered Category: " + category);
			$scope.selectedCategory = category;

			if (category == "All") {
				$scope.displayedItems = $scope.borrowItems;
				return;
			}

			$scope.displayedItems = [];
			for (let i = 0; i < $scope.borrowItems.length; i++) { 
				let item = $scope.borrowItems[i];
				if (item.category == category) $scope.displayedItems.push(item);
			}
			refreshMap();
		}

		function initMap(){

			var mapOptions = {
				zoom: 11,
				center: new google.maps.LatLng(37.33, -121.88),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		}

		function refreshMap(data){
			var infoWindow = new google.maps.InfoWindow();

			// Try HTML5 geolocation.
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};

					infoWindow.setPosition(pos);
					infoWindow.setContent('Location found.');
					$scope.map.setCenter(pos);
				}, 
				function() {
					handleLocationError(true, infoWindow, $scope.map.getCenter());
				});
			} 
			else {
				// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, map.getCenter());
			}

			var createMarker = function (item){
				
				console.log(JSON.stringify.item);
				if(typeof item.pictures != 'undefined'){
					var icon = {
					    url: item.pictures[0].url, // url
					    scaledSize: new google.maps.Size(50, 50), // scaled size
					    origin: new google.maps.Point(0,0), // origin
					    anchor: new google.maps.Point(0, 0) // anchor
					};

					var marker = new google.maps.Marker({
						map: $scope.map,
						position: new google.maps.LatLng(item.location),
						title: item.name,
						icon: icon
					});

					var itemURL = "http://localhost:5000/#/rent/" + item._id;
					marker.content = '<div class="infoWindowContent">' + '<img src="' + item.pictures[0].url + '" alt="Image Not Found" style="width:150px; height:150px; "/>' + '</p>' +'<a href="' + itemURL + '">Show Item</a>.' + '</div>';
				}
				else{
					var marker = new google.maps.Marker({
						map: $scope.map,
						position: new google.maps.LatLng(item.location),
						title: item.name
					});

					var itemURL = "http://localhost:5000/#/rent/" + item._id;
					marker.content = '<div class="infoWindowContent">' + '<img src="" alt="Image Not Found" style="width:150px; height:150px; "/>' + '</p>' +'<a href="' + itemURL + '">Show Item</a>.' + '</div>';
				}

				google.maps.event.addListener(marker, 'click', function(){
					infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
					infoWindow.open($scope.map, marker);
				});
				
			}  
			
			for (i = 0; i < $scope.displayedItems.length; i++){
				createMarker($scope.displayedItems[i]);
			}

			$scope.openInfoWindow = function(e, selectedMarker){
				e.preventDefault();
				google.maps.event.trigger(selectedMarker, 'click');
			} 
		}

		function handleLocationError(browserHasGeolocation, infoWindow, pos) {
			infoWindow.setPosition(pos);
			infoWindow.setContent(browserHasGeolocation ?
				'Error: The Geolocation service failed.' :
				'Error: Your browser doesn\'t support geolocation.');
		}
	}
})();