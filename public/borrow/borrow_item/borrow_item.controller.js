(function() { 
  angular
    .module('meanApp')
    .controller('borrowItemController', borrowItemController);
  borrowItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function borrowItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.borrowItem = {};
    $scope.user = {};
    $scope.editButton = "Edit";
    $scope.owner = false;
    $scope.edit = false;
    let id = $stateParams.random;
    

    $http.get('/api/borrow/id/'+id)
      .success(function(data){
        $scope.borrowItem = data;
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
      $http.put('/api/borrow/update', $scope.borrowItem)
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
      $http.delete('/api/borrow/delete/'+id)
        .success(function (data) {
          console.log(data);
          console.log("Item Deleted Succesfully");
          $state.go('borrow');
        })
        .error (function (err) {
          console.log(err);
        })
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
    $scope.toggleReview = function (id) {
      let write = document.getElementById("write");
      let view = document.getElementById("view");
      write.style.display = "none";
      view.style.display = "none";
      document.getElementById(id).style.display = "block";
    }
    $scope.submitReview = function() {
      console.log("Submit Review, TBD");
    }

  }

})();