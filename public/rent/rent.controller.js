(function() { 
	angular
		.module('meanApp')
		.controller('rentController', rentController);
	 rentController.$inject = ['$location','$http','$scope','authentication', 'meanData'];

		function rentController ($location,$http,$scope, authentication, meanData) {
			$scope.categories = ['All', 'Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
			$scope.selectedCategory = $scope.categories[0];
			$scope.displayedItems = [];
			$scope.rentItems = [];
			$scope.loggedIn = authentication.isLoggedIn();
			var geocoder = new google.maps.Geocoder();

			//Retrieve all the requested items to show the request page
			$http.get('/api/lendingItem/getAll')
			.success(function(data){
				//console.log(JSON.stringify(data));
				$scope.rentItems = data;
				$scope.displayedItems = data;
			})
			.error(function(error){
			console.log("Error: " + error);
			});
			

			$scope.filter = function(category) {
				//console.log("Filtered Category: " + category);
				$scope.selectedCategory = category;

				if (category == "All") {
					$scope.displayedItems = $scope.rentItems;
					return;
				}

				$scope.displayedItems = [];
				for (let i = 0; i < $scope.rentItems.length; i++) { 
					let item = $scope.rentItems[i];
					if (item.category == category)
						$scope.displayedItems.push(item);
				}
			}

			function getLatLng(address){
				geocoder.geocode( { 'address': address}, function(results, status) {
						if (status == 'OK') {
							return results[0].geometry.location;
						} else {
							console.log('Geocode was not successful for the following reason: ' + status);
						}
					});
			}
			// initMap();

			// function initMap(){
			//   var uluru = {lat: 37.712, lng: -122.092};
			//   var map = new google.maps.Map(document.getElementById('map'), {
			//         zoom: 15,
			//         center: uluru,
			//       });

			//     var marker = new google.maps.Marker({
			//     position: uluru,
			//     map: map
			//   });
			// }


			// function display(){
			//   console.log("display here> " + JSON.stringify($scope.rentItems));

			//   var ids = [];
			//   for (let i = 0; i < $scope.rentItems.length; i++) { 
			//     let item = $scope.rentItems[i];
			//     console.log("Item " + i + ": " + item.ownerId);
			//     ids.push(item.ownerId);
			//   }

			//   gservice.refresh(37.333,-121.887);
			// }

			
		}// end requestController

})();