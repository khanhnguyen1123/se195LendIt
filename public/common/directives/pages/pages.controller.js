(function () {

   angular
      .module('meanApp')
      .controller('pagesCtrl', pagesCtrl);
   pagesCtrl.$inject = ['$scope', '$state'];

   function pagesCtrl($scope, $state) {
      $scope.data;

      $scope.pageClasses = ['disabled', 'disabled'];
      $scope.pages = null;

      function addPage (data) {
         let temp = {
            'page' : data,
            'class' : ''
         }
         if (data == $scope.data.current)
            temp.class = "active";
         if (data == "&#8320")
            temp.class = "disabled";
         $scope.pages.push(temp);
      }

      $scope.update = function () {
         if ($scope.data && $scope.pages == null) {
            $scope.pages = [];
            //1 2 3 4 5 6 7
            if ($scope.data.max < 8 ) {
               for (let i=1; i < 8; i++)
                  addPage(i);
            }
            //1 2 3 4 5 ... 9
            else if ($scope.data.current < 5) {
               for (let i=1; i< 6; i++)
                  addPage(i);
               addPage("...");
               addPage($scope.data.max);
            }
            //1 ... 5 6 7 8 9
            else if ( ($scope.data.max - $scope.data.current) < 4) {
               addPage(1);
               addPage("...");
               let i = ($scope.data.max - 5);
               for (; i < $scope.data.max; i++)
                  addPage(i+1)
            }
            //1 ... 4 5 6 7 8 ... 11
            else {
               addPage(1);
               addPage("...");
               let i = ($scope.data.current-2);
               let max = ($scope.data.current + 3);
               for (; i < max; i++)
                  addPage(i);
               addPage("...");
               addPage($scope.data.max);
            }
            if ($scope.data.current > 1)
               $scope.pageClasses[0] = '';
            if ($scope.data.current < $scope.max)
               $scope.pageClasses[1] = '';
         }      
      }
   }

})();
