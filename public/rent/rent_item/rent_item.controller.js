(function() { 
  angular
    .module('meanApp')
    .controller('rentItemController', rentItemController);
  rentItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData', 'filepickerService', '$state','$window'];

  function rentItemController ($location, $http, $scope, $stateParams, authentication, meanData, filepickerService, $state,$window) {
    $scope.categories = ['Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
    $scope.states = ['Available', 'Unavailble'];
    $scope.priceOptions = ['per hour', 'per day', 'per week'];
    $scope.reviewForm = {};
    $scope.rentItem = {};
    $scope.paymentLabel = "";
    $scope.paymentLength = 0;
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
    var inputFrom = document.getElementById('address');
    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
    var place = autocompleteFrom.getPlace();
      $scope.rentItem.location.lat = Math.round(parseFloat(place.geometry.location.lat()) * 1000) / 1000;
      $scope.rentItem.location.lng = Math.round(parseFloat(place.geometry.location.lng()) * 1000) / 1000;
    });
    $scope.writeReview = false;
    $scope.reviews = [false, false];
    let id = $stateParams.random;
    getItem();

    function getItem() {
      $http.get('/api/rent/id/'+id)
      .success(function(data) {
        $scope.rentItem = data;
        $scope.paymentLabel = data.priceOption.split(" ")[1]+"s";
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .finally (function () {
        checkUser();
        initMap();
      });
    }

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
          if ($scope.rentItem && $scope.user._id == $scope.rentItem.ownerId) {
            $scope.owner = true;
            $scope.message.name = $scope.user.name;
          }
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
    $scope.updateOther = function() {
      let updateData = {
        "otherId" : $scope.rentItem.otherId,
        "itemId" : $scope.rentItem._id
      };
      $http.put('/api/rent/other', updateData)
         .success( function(data) {
            console.log(data);
            $scope.alert = {
              'class' : 'alert-success',
              'message' : 'Renter Update Successfully',
              'show' : true,
            };
         })
         .error ( function(err) {
            $scope.alert = {
              'class' : 'alert-danger',
              'message' : 'Renter Update Failed',
              'show' : true,
            };
         })
         .finally( function() {
            getItem();
         })
    }
    
    $scope.makePayment = function() {
      var day =1;
      if($scope.paymentLabel == 'weeks'){
        day = 7;
        console.log("insde weeks testing");
      }
      var endDate = new Date();
      endDate.setDate(endDate.getDate() + (day*$scope.paymentLength));

      $scope.itemCost= {
        price: $scope.paymentLength * $scope.rentItem.price,
        renterId : authentication.currentUser()._id,
        ownerId: $scope.rentItem.ownerId,
        itemName: $scope.rentItem.name,
        itemDescription: $scope.rentItem.description,
        itemImage: $scope.rentItem.pictures[0].url,
        itemId: $scope.rentItem._id,
        itemEndDate: endDate
      };
    

      var confirm = $window.confirm("Confirm Your payment for "+$scope.itemCost.price);
      if (confirm) {
        $http.post('/create', $scope.itemCost)
          .success(function(data){
            console.log('khanh successfully inside make paypal payment scope '+JSON.stringify(data));   
            $window.location.href = data.link;
          })
          .error(function(data) {
            console.log('Error fail calling makePaypalPayment: ' + data);
          });
      } 
    }

    //Sends message to user
    $scope.sendMessage = function () {
      let newMessage = {
        users: [],
        messages: [],
        other: $scope.rentItem.ownerId
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
        'userId': $scope.rentItem.ownerId,
        'userName': $scope.rentItem.ownerName,
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
      if (typeof $scope.rentItem.location != 'undefined') {
        var location =  new google.maps.LatLng($scope.rentItem.location.lat, $scope.rentItem.location.lng);
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
