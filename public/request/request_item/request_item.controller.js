(function() { 
   angular
      .module('meanApp')
      .controller('requestItemController', requestItemController);
   requestItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

   function requestItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
      $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.requestedItem = {};
      $scope.user = {};
      $scope.editButton = "Edit";
      $scope.owner = false;
      $scope.edit = false;
      //Retrieve a particular items to show in the detail page
      let id = $stateParams.random;
      $http.get('/api/requestedItem/get/'+id)
         .success(function(data){
            console.log(JSON.stringify(data));
            $scope.requestedItem = data;
         })
         .error(function(error) {
            console.log('Error: ' + error);
         });
      if (authentication.isLoggedIn()) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
            })
            .error(function (e) {
               console.log(e);
            }); 
         if ($scope.user._id == $scope.requestedItem.ownerId) 
            $scope.owner = true;
      }

      $scope.updateRequest = function () {
         if (!$scope.owner)
            return;
         $http.post('/api/requestedItem/update', $scope.requestedItem)
            .success(function(data){
               console.log(JSON.stringify(data));
               $scope.editMessage = "Request Updated Successful!";
               document.getElementById('editAlert').classList.add("alert-success");
            })
            .error(function(data){
               console.log(data);
               $scope.editMessage = "Request Update Failed";
               document.getElementById('editAlert').classList.add("alert-danger");
            })
         $('.alert').show();
         $scope.toggleEdit();
      }
      $scope.deleteRequest = function () {
         if (!$scope.owner)
            return;
         $http.delete('/api/requestedItem/delete/'+id)
            .success(function (data) {
               console.log(data);
               console.log("Request Deleted Succesfully");
               $state.go('request');
            })
            .error (function (err) {
               console.log(err);
            })
      }
      $scope.updateImage = function() {
         filepickerService.pickMultiple({
            mimetype: 'image/*',
            language: 'en',
            maxFiles: 10,
            services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
            openTo: 'IMAGE_SEARCH'
         }, function(data){
            console.log(JSON.stringify(data));
            $scope.requestedItem.pictures = data;
            $scope.$apply();
         });
      };
      $scope.toggleEdit = function () {
         console.log("toggle");
         let form = document.getElementById("editRequest");
         let item = document.getElementById("item");
         if ($scope.edit) {
            form.style.display = "none";
            item.style.display = "block";
            $scope.edit =! $scope.edit;
            $scope.editButton = "Edit";
         } else {
            form.style.display = "block";
            item.style.display = "none";
            $scope.edit =! $scope.edit;
            $scope.editButton = "View Changes";
         }
      }
      $scope.closeAlert = function () {
         if ($scope.editMessage == "Request Updated Successful!")
            document.getElementById('editAlert').classList.remove('alert-success');
         else
            document.getElementById('editAlert').classList.remove('alert-danger');
         $scope.editMessage = "";
         document.getElementById('editAlert').style.display = "none";
      }
   }
})();
                    