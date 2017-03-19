(function () {

   angular
      .module('meanApp')
      .controller('pagesCtrl', pagesCtrl);
   pagesCtrl.$inject = ['$scope', '$state'];

   function pagesCtrl($scope, $state) {
      $scope.current;
      $scope.max;
      $scope.next;

      $scope.pageClasses = ['disabled', 'disabled'];
      $scope.pages = null;

      function addPage (data) {
         let temp = {
            'page' : data,
            'class' : ''
         }
         if (data == $scope.current)
            temp.class = "active";
         if (data == "&#8320")
            temp.class = "disabled";
         $scope.pages.push(temp);
      }

      function update() {
         if ($scope.current && $scope.max && $scope.pages == null) {
            $scope.pages = [];
            //1 2 3 4 5 6 7
            if ($scope.max < 8 ) {
               for (let i=1; i < 8; i++)
                  addPage(i);
            }
            //1 2 3 4 5 ... 9
            else if ($scope.current < 5) {
               for (let i=1; i< 6; i++)
                  addPage(i);
               addPage("...");
               addPage($scope.max);
            }
            //1 ... 5 6 7 8 9
            else if ( ($scope.max - $scope.current) < 4) {
               addPage(1);
               addPage("...");
               let i = ($scope.max - 5);
               for (; i < $scope.max; i++)
                  addPage(i+1)
            }
            //1 ... 4 5 6 7 8 ... 11
            else {
               addPage(1);
               addPage("...");
               let i = ($scope.current-2);
               let max = ($scope.current + 3);
               for (; i < max; i++)
                  addPage(i);
               addPage("...");
               addPage($scope.max);
            }
            if ($scope.current > 1)
               $scope.pageClasses[0] = '';
            if ($scope.current < $scope.max)
               $scope.pageClasses[1] = '';
         }      
      }

      $scope.change = function (data) {
         if (data == 'prev' && $scope.pageClasses[0]=='disabled')
            return;
         else if (data == 'next' && $scope.pageClasses[1]=='disabled')
            return;
         else if (data == '...')
            return;

         if (data == 'prev')
            $scope.next = $scope.current-1;
         else if (data == 'next')
            $scope.next = $scope.current+1;
         else
            $scope.next = data;
      }

      $scope.refresh = function () {
         $scope.pageClasses = ['disabled', 'disabled'];
         $scope.pages = null;
         update();
      }
   }

})();
