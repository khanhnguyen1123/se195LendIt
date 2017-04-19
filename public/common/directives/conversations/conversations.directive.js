(function () {

  angular
    .module('meanApp')
    .directive('conversations', conversations);

  function conversations () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/conversations/conversations.template.html',
      controller: 'conversationsCtrl',
      scope: true, 
      link: function(scope, element, attributes) {
        attributes.$observe('data', function(data) {
          if (data) {
            scope.conv = angular.fromJson(data);
            if (scope.conv[0])
              scope.id = scope.conv[0].userId;
          }
          if (scope.conv.length > 0)
            console.log(scope.conv);
        })
      }
    };
  }

})();