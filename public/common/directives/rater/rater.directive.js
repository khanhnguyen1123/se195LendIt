(function () {

  angular
    .module('meanApp')
    .directive('rater', rater);

  function rater () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/rater/rater.template.html',
      controller: 'raterCtrl',
      scope: { rating: '=ngModel'}
    };
  }

})();