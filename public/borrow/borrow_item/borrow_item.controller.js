(function() { 
  angular
    .module('meanApp')
    .controller('borrowItemController', borrowItemController);
  borrowItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function borrowItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.borrowItem = {};
    $scope.review = {};
    $scope.user = {};
    $scope.editButton = "Edit";
    $scope.owner = false;
    $scope.edit = false;
    $scope.writeReview = false;
    let id = $stateParams.random;
    

    
    if (authentication.isLoggedIn()) {
      meanData.getProfile()
        .success(function(data) {
          $scope.user = data;
        })
        .error(function (e) {
          console.log(e);
        })
        .then( function () {
          if ($scope.user._id == $scope.borrowItem.ownerId)
            $scope.owner = true;
          calculateReviews($scope.borrowItem.reviews);
        });
    }
    $http.get('/api/borrow/id/'+id)
      .success(function(data){
        $scope.borrowItem = data;
        $scope.borrowItem.aRating = 0;
        $scope.borrowItem.numReviews = data.reviews.length;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      }).then (function () {
        calculateReviews($scope.borrowItem.reviews);
        updateState();
      });
    var updateState = function () {
      let itemState = document.getElementById('item-state');
      if ($scope.borrowItem.state == "Available")
        itemState.style.color = "green";
      else
        itemState.style.color = "red";  
    }

    function calculateReviews(reviews) {
      if (!$scope.owner && $scope.user) 
        $scope.writeReview = true;
      if (reviews.length > 0) { 
        for (let i=0; i< reviews.length; i++) {
          let temp = reviews[i];
          $scope.borrowItem.aRating += temp.rating;
          if (temp.user == $scope.user._id) {
            $scope.writeReview = false;
          }
        }
        $scope.borrowItem.aRating =  ($scope.borrowItem.aRating/reviews.length);
      }
      else
        document.getElementById("reviews").innerHTML = "No Reviews";
    }
    $scope.upload = function() {
      filepickerService.pickMultiple({
        mimetype: 'image/*',
        language: 'en',
        maxFiles: 10,
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'IMAGE_SEARCH'
      }, function(data){
        //console.log(JSON.stringify(data));
        $scope.borrowItem.pictures = data;
        $scope.$apply();
      });
    };
    $scope.updateItem = function (message) {
      if ($scope.owner)
        return;
      $http.put('/api/borrow/update', $scope.borrowItem)
        .success(function(data){
          //console.log(JSON.stringify(data));
          $scope.editMessage = "Item Updated Successful!";
          document.getElementById('editAlert').classList.add("alert-success");
        })
        .error(function(data){
          //console.log(data);
          $scope.editMessage = "Item Update Failed";
          document.getElementById('editAlert').classList.add("alert-danger");
        });
      $('.alert').show();
      $('body').scrollTop(0);
      $scope.toggleEdit();
    }
    $scope.deleteItem = function () {
      if (!$scope.owner)
        return;
      $http.delete('/api/borrow/delete/'+id)
        .success(function (data) {
          console.log(data);
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
      if (authentication.isLoggedIn() && $scope.writeReview) {
        $scope.review.user = $scope.user._id;
        $scope.review.username = $scope.user.name;
        $scope.review.date = new Date();
        console.log("submit");
        $scope.borrowItem.reviews.push($scope.review);
        $scope.updateItem();
        $scope.toggleEdit();
        $scope.editMessage = "Review Posted Successfully";
        console.log($scope.editMessage);
        $scope.writeReview = false;
        document.getElementById('write').style.display = "none";
        $('body').scrollTop(0);
        //Post to Server;
      }
    }

  }

})();