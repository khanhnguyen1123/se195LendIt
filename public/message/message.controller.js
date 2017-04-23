(function() {
  
   angular
      .module('meanApp')
      .controller('messageController', messageController);
   messageController.$inject = ['$scope', '$http', '$stateParams', 'authentication', '$window', 'meanData'];

   function messageController($scope, $http, $stateParams, authentication, $window, meanData) {
      $scope.response = {'data' : ''};
      $scope.user;
      $scope.conversations;
      $scope.selectedConv;

      if (authentication.isLoggedIn()) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
            })
            .error(function (e) {
               console.log(e);
            })
            .finally( function() {
               getMessages();
            });
      }

      function getMessages(id) {
         $http.get('api/message/get/'+$scope.user._id)
            .success( function(data) {
               $scope.conversations = data;
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally (function() {
               for (conv in $scope.conversations) {
                  if (id && conv._id == id)
                     $scope.selectedConv = conv;
               }

            });
      }

      $scope.selectConversation = function(data) {
         if ($scope.selectedConv) {
            var temp = document.getElementById($scope.selectedConv._id)
            if (temp != null)
               temp.style.backgroundColor = "white";
         }
         var temp = document.getElementById(data._id);
         if (temp != null)
            temp.style.backgroundColor = "#B6D8E3";
         $scope.selectedConv = data;
      }

      $scope.deleteMessage = function(data) {
         console.log(data);
         $http.delete('api/message/delete/'+data._id)
            .success( function(data) {
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally ( function() {
               $scope.selectedConv = null;
               getMessages();
            })
      }

      $scope.sendMessage = function () {
         if ($scope.response.data == '' || !$scope.selectedConv)
            return;
         let newMessage = {
            class : 'convUser',
            content : $scope.response.data,
            date : new Date()
         }
         $scope.selectedConv.messages.push(newMessage);
         $scope.response.data = "";
         $http.put('api/message/send', $scope.selectedConv)
            .success( function(data) {
               //console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               
            });
      }
   }
})();