(function() { 
  angular
    .module('meanApp')
    .controller('borrowItemController', borrowItemController);
  borrowItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService'];

  function borrowItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.borrowItem = {};
    $scope.user = {};
    $scope.editButton = "Edit";
    $scope.owner = false;
    $scope.edit = false;
    let id = $stateParams.random;
    

    $http.get('/api/borrow/get/'+id)
      .success(function(data){
        console.log(JSON.stringify(data));
        $scope.borrowItem = data;
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
      if ($scope.user._id == $scope.borrowItem.ownerId) 
        $scope.owner = true;
    }
    var updateState = function () {
      console.log($scope.borrowItem.state);
      let itemState = document.getElementById('item-state');
      if ($scope.borrowItem.state == "Available")
        itemState.style.color = "green";
      else
        itemState.style.color = "red";  
    }
    $scope.upload = function() {
      filepickerService.pickMultiple({
        mimetype: 'image/*',
        language: 'en',
        maxFiles: 10,
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'IMAGE_SEARCH'
      }, function(data){
        console.log(JSON.stringify(data));
        $scope.borrowItem.pictures = data;
        $scope.$apply();
      });
    };
    $scope.updateItem = function () {
      if (!$scope.owner)
        return;
      document.getElementById('editAlert').classList.add("alert-success");
      $http.post('/api/borrow/update', $scope.borrowItem)
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
    $scope.toggleEdit = function () {
      console.log("toggle");
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