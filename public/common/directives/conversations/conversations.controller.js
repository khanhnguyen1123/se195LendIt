(function () {

   angular
      .module('meanApp')
      .controller('conversationsCtrl', conversationsCtrl);
   conversationsCtrl.$inject = ['$scope', '$http'];

   function conversationsCtrl($scope, $http) {
      $scope.response = { data : '' };
      $scope.delete = function(c) {
         console.log("Delete");
         console.log(c);
         $http.delete('api/message2/delete/'+c._id)
            .success( function(data) {
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               updateMessages();
            })
      }
      $scope.send = function(c) {
         let newMessage = {
            class : 'convUser',
            content : c.response,
            date : new Date()
         }
         c.messages.push(newMessage);
         c.response = "";
         $http.put('api/message2/send', c)
            .success( function(data) {
               //console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               let container = document.getElementById(c._id);
               container.scrollTop = container.scrollHeight;
            });
      }

      function updateMessages () {
         if (!$scope.id)
            return;
         $http.get('api/message2/get/'+$scope.id)
            .success( function(data) {
               $scope.conv = data;
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               //deleteMessage();
            });
      }
   }

})();
