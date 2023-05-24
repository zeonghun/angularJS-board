
var dashboardFactory = new BoardFactory();
convergence.factory("BoardFactory", dashboardFactory.boardFactory);

convergence.controller("ConvergenceCtrl", function ($scope, $route, $http, $timeout, $window //
    , BoardFactory) {

    $scope.boardList = [];

    $scope.clicked = false;

    /**
     * 전체 게시물 조회
     * 
     * @param {*} promiseFunc 
     */
    $scope.getBoards = function (promiseFunc) {

        BoardFactory.getBoards($scope,
            function (res) {
                $scope.boardList = res.data;
                $scope.totalItems = res.data.length;
            },
            function (msg) {

            });
    }

    /**
     * 특정 게시물 조회
     * 
     * @param {*} bno 
     * @param {*} promiseFunc 
     */
    $scope.getBoard = function (bno, promiseFunc) {
        BoardFactory.getBoard($scope, bno,
            function (res) {

            },
            function (msg) {

            })
    }

    /**
     * 게시물 추가
     * 
     * @param {*} promiseFunc 
     */
    $scope.insertBoard = function (board, promiseFunc) {

        console.debug(board);

        let body = {
            bno: board.bno,
            title: board.title,
            writer: board.writer,
            content: board.content,
        };

        //$scope.tableMasking.setMasking();
        BoardFactory.insertBoard($scope, body,
            function (res) {
                //$scope.tableMasking.forceFreeMasking();
                $scope.getBoards();
                if (promiseFunc != undefined) {
                    promiseFunc(true);
                }
            },
            function (response) {
                console.debug(response.message);
                //$scope.tableMasking.forceFreeMasking();
                $scope.getBoards();
                if (promiseFunc != undefined) {
                    promiseFunc(false);
                }
            })
        clearInput();
    }

    /**
     * 게시물 삭제
     * 
     * @param {*} bno 
     * @param {*} promiseFunc 
     */
    $scope.deleteBoard = function (bno, promiseFunc) {
        //$scope.tableMasking.setMasking();
        BoardFactory.deleteBoard($scope, bno,
            function (res) {
                $scope.getBoards();
            },
            function (msg) {

            })
    }

    /**
     * 게시물 수정
     * 
     * @param {*} promiseFunc 
     */
    $scope.updateBoard = function (board, promiseFunc) {
        let body = {
            bno: board.bno,
            title: board.title,
            writer: board.writer,
            content: board.content,
        };

        //$scope.tableMasking.setMasking();
        BoardFactory.updateBoard($scope, body,
            function (res) {
                $scope.getBoards();
                $scope.clicked = !$scope.clicked;
                //$scope.tableMasking.forceFreeMasking();
                if (promiseFunc != undefined) {
                    promiseFunc(true);
                }
            },
            function (response) {
                console.debug(response.message);
                //$scope.tableMasking.forceFreeMasking();
                $scope.getBoards();
                $scope.clicked = !$scope.clicked;
                if (promiseFunc != undefined) {
                    promiseFunc(false);
                }
            })
    }

    /**
     * 수정 Form 보여주기/숨기기
     * 
     * @param {*} board 
     */
    $scope.toggleClicked = function (board) {
        $scope.clicked = !$scope.clicked;
        $scope.selectedBoard = JSON.parse(JSON.stringify(board));
    };

    /**
     * input-box 초기화
     */
    let clearInput = function () {
        $scope.board.title = "";
        $scope.board.writer = "";
        $scope.board.content = "";
    }

    $scope.getBoards();
    $scope.getBoard(1);
    //$scope.deleteBoard(6);
    //$scope.insertBoard({ bno: 6, title: 'aaa', writer: 'bbb', content: 'ccc' });
    //$scope.updateBoard({ bno: 6, title: 'xxx', writer: 'yyy', content: 'zzz' });

});
