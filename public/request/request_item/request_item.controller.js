(function() { 
  angular
    .module('meanApp')
    .controller('requestItemController', requestItemController);
  requestItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state'];

  function requestItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
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
    }
    
    let id = $stateParams.random;

    var inputFrom = document.getElementById('address');
    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
    var place = autocompleteFrom.getPlace();
      $scope.rentItem.location.lat = Math.round(parseFloat(place.geometry.location.lat()) * 1000) / 1000;
      $scope.rentItem.location.lng = Math.round(parseFloat(place.geometry.location.lng()) * 1000) / 1000;
    });

    $http.get('/api/request/id/'+id)
      .success(function(data) {
        $scope.requestItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .then (function () {
        checkUser();
        initMap();
      });

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
        .then( function () {
          if ($scope.requestItem && $scope.user._id == $scope.requestItem.ownerId) {
            $scope.owner = true;
            $scope.message.name = $scope.user.name;
          }
          else
            $scope.owner = false;
        });
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
        $scope.requestItem.pictures = data;
        $scope.$apply();
      });
    };

    $scope.updateItem = function () {
      $http.put('/api/request/update', $scope.requestItem)
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
      $http.delete('/api/request/delete/'+id)
        .success(function (data) {
          //console.log(data);
          $state.go('request');
        })
        .error (function (err) {
          console.log(err);
        })
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
        other: $scope.requestItem.ownerId
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
        'userId': $scope.requestItem.ownerId,
        'userName': $scope.requestItem.ownerName,
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
      if (typeof $scope.requestItem.location != 'undefined') {
        var location =  new google.maps.LatLng($scope.requestItem.location.lat, $scope.requestItem.location.lng);
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