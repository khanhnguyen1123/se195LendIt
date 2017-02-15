(function () {

  angular
    .module('meanApp')
    .directive('images', navigation);

  function images () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/images/images.template.html',
      controller: 'imagesCtrl'
    };
  }

})();