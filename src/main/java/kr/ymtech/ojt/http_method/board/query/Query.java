package kr.ymtech.ojt.http_method.board.query;

/**
 * (non-javadoc)
 * 
 * @author zeonghun
 * @since 2023.04.17
 */
public class Query {

    // 전체 게시물 조회
    public static final String BOARD_READ_ALL = "SELECT * FROM board";

    // 게시물 조회
    public static final String BOARD_READ = "SELECT * FROM board WHERE bno = ?";

    // 게시물 추가
    public static final String BOARD_INSERT = "INSERT INTO board VALUES(?, ?, ?, ?)";

    // 게시물 삭제
    public static final String BOARD_DELETE = "DELETE FROM board WHERE bno = ?";

    // 게시물 수정
    public static final String BOARD_UPDATE = "UPDATE board SET title = ?, writer = ?, content = ? WHERE bno = ?";
}
