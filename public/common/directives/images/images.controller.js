(function () {

  angular
    .module('meanApp')
    .controller('imagesCtrl', imagesCtrl);
  imagesCtrl.$inject = ['$scope'];

  function imagesCtrl($scope) {
	if (!$scope.pictures) {
		$scope.pictures = {};
	}
	
	$scope.updatePicture = function(pic) {
		$scope.mainPic = pic.url;
	}	
  }

})();
