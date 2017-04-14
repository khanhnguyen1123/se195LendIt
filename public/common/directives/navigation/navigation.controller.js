(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);
  navigationCtrl.$inject = ['$location','authentication','$interval','$http'];

  function navigationCtrl($location, authentication,$interval,$http) {
    var vm = this;
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    
    vm.lastCountMessages;
    vm.newCountMessage;
    vm.diff;

    
    //adding logout user
    vm.logout = function(){
    	//console.log("khanh logout is pressed ");
    	authentication.logout();
    	// try to fix bug: call vm.isloggedin again to clear bug of pressing logout
      vm.isLoggedIn = authentication.isLoggedIn();
      $location.path('/');
    };// end logout function

    vm.getLastMessageLenght = function(){
      $http.post('/api/message/getLength',authentication.currentUser())
      .success(function(data){       
        vm.lastCountMessages = data.lastViewMessageLenght;

      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
    };//end get last message length
    vm.getLastMessageLenght();
    //  get all received messages
    vm.getReceievedMessagesLength = function(){
      $http.post('/api/message/getNewLengthMessage',authentication.currentUser())
      .success(function(data){       
        vm.newCountMessage = data.newLengthMesage;
        
        vm.diff = vm.newCountMessage - vm.lastCountMessages;
        if(vm.diff<0){vm.diff=0; }
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
    };// end get recieved messages
    vm.getReceievedMessagesLength();

    // this call is update every 4 second to get new messages count
    $interval(function(){
            $http.post('/api/message/getNewLengthMessage',authentication.currentUser())
              .success(function(data){       
                vm.newCountMessage = data.newLengthMesage;
                vm.diff = vm.newCountMessage - vm.lastCountMessages;
                if(vm.diff<0){vm.diff=0; }
              })
              .error(function(error) {
                console.log('Error: ' + error);
              });
            
      }, 4000); // end interval call

    vm.resetDiff = function(){
      vm.diff = 0;
      var update = {
        _id: authentication.currentUser()._id,
        newLenght: vm.newCountMessage
      };
      $http.post('/api/message/updateLength',update)
      .success(function(data){   
       // vm.getLastMessageLenght();    
        vm.lastCountMessages = vm.newCountMessage;
      //  vm.getReceievedMessages();
        
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
    }; // end reset diff    
  }// end navigationCtrl

})();
