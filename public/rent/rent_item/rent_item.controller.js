(function() { 
  angular
    .module('meanApp')
    .controller('rentItemController', rentItemController);
  rentItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function rentItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.priceOptions = ['per hour', 'per day', 'per week'];
    $scope.reviewForm = {};
    $scope.alert = {
      'class' : '',
      'message' : '',
      'show' : false,
    };
    $scope.item = {
      'display' : true,
      'edit' : false,
      'editButton' : 'Edit Item'
    };
    $scope.writeReview = false;
    $scope.reviews = [false, false];
    let id = $stateParams.random;
    
    $http.get('/api/rent/id/'+id)
      .success(function(data) {
        $scope.rentItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .then (function () {
        checkUser();
      });


    function checkUser() {
      updateState();
      if (!authentication.isLoggedIn())
        return;
      meanData.getProfile()
        .success(function(data) {
          $scope.user = data;
        })
        .error(function (e) {
          console.log(e);
        })
        .then( function () {
          if ($scope.rentItem && $scope.user._id == $scope.rentItem.ownerId)
            $scope.owner = true;
          else
            $scope.owner = false;
          checkWriteReview();
        });
    }
    function updateState () {
      let itemState = document.getElementById('item-state');
      if ($scope.rentItem.state == "Available")
        itemState.style.color = "green";
      else
        itemState.style.color = "red";  
    }
    function checkWriteReview () {
      if (!$scope.owner && $scope.user && $scope.rentItem) {
        $scope.writeReview = true;
        for (let i=0; i< $scope.rentItem.reviews.length; i++) {
          if ($scope.rentItem.reviews[i].user == $scope.user._id)
            $scope.writeReview = false;
        }
      }
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
        $scope.rentItem.pictures = data;
        $scope.$apply();
      });
    };

    $scope.updateItem = function (message) {
      $http.put('/api/rent/update', $scope.rentItem)
        .success(function(data){
          $scope.alert = {
            'class' : 'alert-success',
            'message' : 'Item Updated Successful',
            'show' : true,
          };
        })
        .error(function(data){
          //console.log(data);
          $scope.editMessage = "Item Update Failed";
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Item Update Failed',
            'show' : true,
          };
        });
      $('.alert').show();
      $('body').scrollTop(0);
      $scope.toggleEdit();
    }

    $scope.deleteItem = function () {
      $http.delete('/api/rent/delete/'+id)
        .success(function (data) {
          //console.log(data);
          $state.go('rent');
        })
        .error (function (err) {
          console.log(err);
        })
    }
    $scope.submitReview = function() {
      if ($scope.user && $scope.writeReview && $scope.owner == false) {
        $scope.reviewForm.user = $scope.user._id;
        $scope.reviewForm.username = $scope.user.name;
        $scope.reviewForm.date = new Date();

        $http.put('/api/rent/review/'+$scope.rentItem._id, $scope.reviewForm)
          .success( function(data) {
            $scope.rentItem = data;
            $scope.reviewForm = {};
          })
          .error ( function(err) {
            console.log(err);
          })
          .then (function () {
            $('body').scrollTop(0);
            $scope.alert = {
              'class' : 'alert-success',
              'message' : 'Review Added Successfully',
              'show' : true,
            };
            $scope.writeReview = false;
            $scope.reviews[0] = false;
          });
      }
    }
    $scope.toggleReviews = function(data) {
      if (data == 0) {
        $scope.reviews[data] = !$scope.reviews[data];
        $scope.reviews[1] = false;
      }
      else {
        $scope.reviews[data] = !$scope.reviews[data];
        $scope.reviews[0] = false; 
      }
    }
    $scope.toggleEdit = function () {
      if ($scope.item.display) {
        $scope.item = {
          'display' : false,
          'edit' : true,
          'editButton' : 'View Item',
        }
      } else {
        $scope.item = {
          'display' : true,
          'edit' : false,
          'editButton' : 'Edit Item',
        }
      }
    }

  }

})();