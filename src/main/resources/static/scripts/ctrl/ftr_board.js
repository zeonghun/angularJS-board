BoardFactory = function () {
    this.boardFactory = function ($log, $http, $rootScope, $uibModal, BoardManager) {
        var __rtn__ = {
            getBoards: function ($scope, fnSuccess, fnError) {
                BoardManager.getBoards({

                },
                    function (response, headers) {
                        console.debug('response: ', response);
                        if (response.result && fnSuccess != null) {
                            fnSuccess.call($scope, response);
                        }
                        if (!response.result && fnError != null) {
                            fnError.call($scope, response);
                        }
                    },
                    function (response) {
                        console.debug('error: ', response);
                        if (fnError != null) {
                            fnError.call($scope, response);
                        }
                    });
            },

            getBoard: function ($scope, bno, fnSuccess, fnError) {
                BoardManager.getBoard({
                    param1: bno
                },
                    function (response, headers) {
                        console.debug('response: ', response);
                        if (response.result && fnSuccess != null) {
                            fnSuccess.call($scope, response);
                        }
                        if (!response.result && fnError != null) {
                            fnError.call($scope, response);
                        }
                    },
                    function (response) {
                        console.debug('error: ', response);
                        if (fnError != null) {
                            fnError.call($scope, response);
                        }
                    });
            },

            insertBoard: function ($scope, body, fnSuccess, fnError) {
                BoardManager.insertBoard({
                    param1: ""
                }, body,
                    function (response, headers) {
                        console.debug('response: ', response);
                        if (response.result && fnSuccess != null) {
                            fnSuccess.call($scope, response);
                        }
                        if (!response.result && fnError != null) {
                            fnError.call($scope, response);
                        }
                    },
                    function (response) {
                        console.debug('error: ', response);
                        if (fnError != null) {
                            fnError.call($scope, response);
                        }
                    });
            },

            deleteBoard: function ($scope, bno, fnSuccess, fnError) {
                BoardManager.deleteBoard({
                    param1: "delete",
                    param2: bno
                },
                    function (response, headers) {
                        console.debug('response: ', response);
                        if (response.result && fnSuccess != null) {
                            fnSuccess.call($scope, response);
                        }
                        if (!response.result && fnError != null) {
                            fnError.call($scope, response);
                        }
                    },
                    function (response) {
                        if (fnError != null) {
                            fnError.call($scope, response);
                        }
                    });
            },

            updateBoard: function ($scope, body, fnSuccess, fnError) {
                BoardManager.updateBoard({
                    param1: ""
                }, body,
                    function (response, headers) {
                        console.debug('response: ', response);
                        if (response.result && fnSuccess != null) {
                            fnSuccess.call($scope, response);
                        }
                        if (!response.result && fnError != null) {
                            fnError.call($scope, response);
                        }
                    },
                    function (response) {
                        console.debug('error: ', response);
                        if (fnError != null) {
                            fnError.call($scope, response);
                        }
                    });
            },

        };
        return __rtn__;
    };
}