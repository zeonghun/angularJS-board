convergence.factory("BoardManager", function ($resource) {
    return $resource(ctx + "/boards/:param1/:param2/:param3/:param4/:param5", null, {

        getBoards: {
            desc: "전체 게시물 조회",
            method: "GET"
        },

        getBoard: {
            desc: "특정 게시물 조회",
            method: "GET"
        },

        insertBoard: {
            desc: "게시물 추가",
            method: "POST"
        },

        deleteBoard: {
            desc: "게시물 삭제",
            method: "DELETE"
        },

        updateBoard: {
            desc: "게시물 수정",
            method: "PATCH"
        },

    });
});