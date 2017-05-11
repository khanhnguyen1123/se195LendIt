(function() { 
  angular
    .module('meanApp')
    .controller('borrowItemController', borrowItemController);
  borrowItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function borrowItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];

    //$scope.borrowItem = {};
    //$scope.user = {};

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
    $scope.message = {
      'name' : '',
      'content' : ''
    };
    $scope.writeReview = false;
    $scope.reviews = [false, false];
    let id = $stateParams.random;

    var inputFrom = document.getElementById('address');
    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
    var place = autocompleteFrom.getPlace();
      $scope.rentItem.location.lat = Math.round(parseFloat(place.geometry.location.lat()) * 1000) / 1000;
      $scope.rentItem.location.lng = Math.round(parseFloat(place.geometry.location.lng()) * 1000) / 1000;
    });

    //Gets Item
    $http.get('/api/borrow/id/'+id)
      .success(function(data) {
        $scope.borrowItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .then (function () {
        checkUser();
      });
    //Checks User 
    function checkUser() {
      if (!authentication.isLoggedIn())
        return;
      meanData.getProfile()
        .success(function(data) {
          $scope.user = data;
        })
        .error(function (e) {
          console.log(e);
        })
        .finally( function () { 
          if ($scope.borrowItem && $scope.user._id == $scope.borrowItem.ownerId) {
            $scope.owner = true;
            $scope.message.name = $scope.user.name;
          }
          else
            $scope.owner = false;
          checkWriteReview();
          updateState();
          initMap();
        });
    }
    //Updates Item State
    function updateState () {
      let itemState = document.getElementById('item-state');
      if ($scope.borrowItem.state == "Available")
        itemState.style.color = "green";
      else
        itemState.style.color = "red";  
    }
    //Checks if user can write a review
    function checkWriteReview () {
      if (!$scope.owner && $scope.user && $scope.borrowItem) {
        $scope.writeReview = true;
        for (let i=0; i< $scope.borrowItem.reviews.length; i++) {
          if ($scope.borrowItem.reviews[i].user == $scope.user._id)
            $scope.writeReview = false;
        }
      }
    }
    //Upload New Item Image
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
      $http.put('/api/borrow/update', $scope.borrowItem)
        .success(function(data){
          $scope.alert = {
            'class' : 'alert-success',
            'message' : 'Item Updated Successful',
            'show' : true,
          };
        })
        .error(function(data){
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
      $http.delete('/api/borrow/delete/'+id)
        .success(function (data) {
          //console.log(data);
          $state.go('borrow');
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

        $http.put('/api/borrow/review/'+$scope.borrowItem._id, $scope.reviewForm)
          .success( function(data) {
            $scope.borrowItem = data;
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

    //Sends message to user
    $scope.sendMessage = function () {
      let newMessage = {
        users: [],
        messages: [],
        other: $scope.borrowItem.ownerId
      }
      var user = {
        'userId': $scope.user._id,
        'userName': $scope.user.name,
        'userImage': '',
      }
      if ($scope.user.profileImage)
        user.userImage = $scope.user.profileImage.url;
      newMessage.users.push(user);
      user = {
        'userId': $scope.borrowItem.ownerId,
        'userName': $scope.borrowItem.ownerName,
        'userImage': '',
      }
      newMessage.users.push(user);
      newMessage.messages.push($scope.message);
      $http.post('api/message/new', newMessage)
        .success( function(data) {
          $scope.message = {};
          $scope.alert = {
            'class' : 'alert-success',
            'message' : 'Message Sent Successfully',
            'show' : true,
          };
        })
        .error ( function(error) {
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Message Failed To Send',
            'show' : true,
          };
          console.log(error);
        });
    }

    ///Google map view
    function initMap(){
      if (typeof $scope.borrowItem.location != 'undefined') {
        var location =  new google.maps.LatLng($scope.borrowItem.location.lat, $scope.borrowItem.location.lng);
        var mapOptions = {
          zoom: 14,
          center: location,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false
        }
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        marker = new google.maps.Marker({
          map: $scope.map,
          position: location
        });
      }
    };

  }

})();