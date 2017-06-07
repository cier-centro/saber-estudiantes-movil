cont_angular.controller('startPageCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicScrollDelegate) {
        $scope.startRandomTest=function(){
          $state.go("create_questionary")
        }

        $scope.startUploadTest=function(){
          $state.go("upload_questionary")
        }
    }]);
