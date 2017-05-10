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
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally (function() {
               for (let i=0; i<$scope.conversations.length; i++) {
                  let conv = $scope.conversations[i];
                  if (id && conv._id == id)
                     $scope.selectedConv = conv;
                  for (let p=0; p<conv.users.length; p++) {
                     if (conv.users[p].userId != $scope.user._id) {
                        conv.other = conv.users[p];
                     }
                  }
               }

            });
      }

      $scope.selectConversation = function(data) {
         console.log(data);
         if ($scope.selectedConv) {
            var temp = document.getElementById($scope.selectedConv._id)
            if (temp != null)
               temp.style.backgroundColor = "white";
         }
         var temp = document.getElementById(data._id);
         if (temp != null)
            temp.style.backgroundColor = "#B6D8E3";
         $scope.selectedConv = data;
         for (let i=0; i< $scope.selectedConv.messages.length; i++) {
            let message = $scope.selectedConv.messages[i];
            if (message.name == $scope.user.name)
               message.class = 'convUser';
            else
               message.class = 'convOther';
         }
      }

      $scope.deleteMessage = function(data) {
         console.log(data);
         $http.put('api/message/delete/'+data._id, {'userId':$scope.user._id})
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
            name: $scope.user.name,
            content : $scope.response.data,
            other : $scope.selectedConv.other.userId,
            _id : $scope.selectedConv._id
         }
         let other = $scope.selectedConv.other;
         $scope.response.data = "";
         $http.put('api/message/send', newMessage)
            .success( function(data) {
               $scope.selectedConv = data;
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               $scope.selectedConv.other = other;
               $scope.selectConversation($scope.selectedConv);
            });
      }
   }
})();