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
    let id = $stateParams.random;

    $http.get('/api/request/id/'+id)
      .success(function(data) {
        $scope.requestItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .then (function () {
        checkUser();
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
          if ($scope.requestItem && $scope.user._id == $scope.requestItem.ownerId)
            $scope.owner = true;
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
  }
})();