(function() {
  
  angular
    .module('meanApp')
    .controller('messageController', messageController);
  messageController.$inject = ['$scope','$http','$stateParams', 'authentication','$window'];

  function messageController($scope,$http,$stateParams, authentication,$window) {
    $scope.sendMessages = {};
    $scope.receivedMessages = {};
    $scope.message={
      ownerName: authentication.currentUser().name,
      ownerId : authentication.currentUser()._id
    };

    // get all sended messages
    $http.post('/api/message/getSendMessages',authentication.currentUser())
      .success(function(data){       
        $scope.sendMessages = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
    //  get all received messages
    $scope.getReceievedMessages = function(){
      $http.post('/api/message/getReceievedMessages',authentication.currentUser())
      .success(function(data){       
        $scope.receivedMessages = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
    };// end get recieved messages
    $scope.getReceievedMessages();  

    $scope.getInfo = function(id,subject){
      
      $scope.message._id=id;
      $scope.message.subject=subject;
    }; //end get info function  




    $scope.replyMessage = function () {

       $http.post('/api/message/reply',$scope.message)
       .success(function(data){       
          console.log("after send message : "+data.message);
          $window.alert("Message was Sent ");
        })
       .error(function(error) {
          console.log('Error: ' + error);
        }); // end http call
    }; // end send message function

    $scope.delete= function(id){
       var de = {
        _id: id
       }
       $http.post('/api/message/delete',de)
       .success(function(data){       
          console.log("after send message : "+data.message);
          $window.alert("Message was Deleted ");
          $scope.getReceievedMessages();
        })
       .error(function(error) {
          console.log('Error: ' + error);
        }); // end http call 
    }; // end delete fundtion

  };// end message controller funtion
})();