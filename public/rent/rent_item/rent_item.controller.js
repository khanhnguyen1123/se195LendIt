(function() { 
  angular
    .module('meanApp')
    .controller('rentItemController', rentItemController);
  rentItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function rentItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.priceOptions = ['per hour', 'per day', 'per week'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.rentItem = {};
    $scope.user = {};
    $scope.editButton = "Edit";
    $scope.owner = false;
    $scope.edit = false;
    let id = $stateParams.random;

    $http.get('/api/lendingItem/get/'+id)
      .success(function(data){
        console.log(JSON.stringify(data));
        $scope.rentItem = data;
        updateState();
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
      if ($scope.user._id == $scope.rentItem.ownerId) 
        $scope.owner = true;
    }
    var updateState = function () {
      console.log($scope.rentItem.state);
      let itemState = document.getElementById('item-state');
      if ($scope.rentItem.state == "Available")
        itemState.style.color = "green";
      else
        itemState.style.color = "red";  
    }
    //Redirects to Paypal Payment
    $scope.makePaypalPayment = function(){
      console.log("Paypal Payment Processing");
      $http.post('/create', $scope.rentItem)
        .success(function(data){
          console.log('Paypal Payment Success: '+JSON.stringify(data));   
          $window.location.href=data.link;
        })
        .error(function(data) {
          console.log('Paypal Payment Error: ' + data);
        });
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
        $scope.rentItem.pictures = data;
        $scope.$apply();
      });
    };
    $scope.updateItem = function () {
      if (!$scope.owner)
        return;
      document.getElementById('editAlert').classList.add("alert-success");
      $http.post('/api/lendingItem/update', $scope.rentItem)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.editMessage = "Item Updated Successful!";
          document.getElementById('editAlert').classList.add("alert-success");
        })
        .error(function(data){
          console.log(data);
          $scope.editMessage = "Item Update Failed";
          document.getElementById('editAlert').classList.add("alert-danger");
        });
      $('.alert').show();
      $scope.toggleEdit();
    }
    $scope.deleteItem = function () {
      if (!$scope.owner)
        return;
      $http.delete('/api/lendingItem/delete/'+id)
        .success(function (data) {
          console.log(data);
          console.log("Item Deleted Succesfully");
          $state.go('rent');
        })
        .error (function (err) {
          console.log(err);
        })
    }
    $scope.toggleEdit = function () {
      let form = document.getElementById("editItem");
      let item = document.getElementById("item");
      updateState();
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
      if ($scope.editMessage == "Item Updated Successful!")
        document.getElementById('editAlert').classList.remove('alert-success');
      else
        document.getElementById('editAlert').classList.remove('alert-danger');
      $scope.editMessage = "";
      document.getElementById('editAlert').style.display = "none";
    } 
  }

})();