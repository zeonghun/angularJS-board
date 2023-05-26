// var app = angular.module('convergence', ['ui.bootstrap']);

// app.controller('ModalCtrl', function ($scope, $uibModal) {
//     $scope.openModal = function () {
//         var modalInstance = $uibModal.open({
//             templateUrl: "/static/templates/modalContent.html",
//             controller: "ModalContentCtrl",
//             size: '',
//         });

//         modalInstance.result.then(function (response) {

//         });
//     };
// })

convergence.controller('ModalContentCtrl', function ($scope, $uibModalInstance) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }
})