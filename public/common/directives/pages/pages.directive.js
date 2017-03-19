(function () {

  angular
    .module('meanApp')
    .directive('pages', pages);

  function pages () {
    return {
      restrict: 'EA',
      templateUrl: 'public/common/directives/pages/pages.template.html',
      controller: 'pagesCtrl',
      scope: { data: '=ngModel'}
    };
  }

})();