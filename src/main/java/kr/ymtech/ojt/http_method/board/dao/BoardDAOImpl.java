package kr.ymtech.ojt.http_method.board.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.query.Query;
import kr.ymtech.ojt.http_method.board.vo.BoardVO;

/**
 * DB 연동 모듈
 * 
 * @author zeonghun
 * @since 2023.04.17
 */
@Repository
public class BoardDAOImpl implements IBoardDAO {

    // DB drive 경로
    private final static String DB_DRIVE_PATH = "org.mariadb.jdbc.Driver";

    /** DB 접속정보 */
    private final static String DB_URL = "jdbc:mysql://127.0.0.1:3306/board";
    private final static String DB_USER_ID = "root";
    private final static String DB_USER_PASSWORD = "1234";

    /**
     * @see IBoardDAO#findAll()
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public List<BoardVO> findAll() {
        ResultSet rs = null;
        List<BoardVO> boardVOList = new ArrayList<>();

        try {
            Class.forName(DB_DRIVE_PATH);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER_ID, DB_USER_PASSWORD);
            PreparedStatement stmt = con.prepareStatement(Query.BOARD_READ_ALL);
            ) {
            rs = stmt.executeQuery();
            while (rs.next()) {
                int bno = rs.getInt("bno");
                String title = rs.getString("title");
                String writer = rs.getString("writer");
                String content = rs.getString("content");
                boardVOList.add(new BoardVO(bno, title, writer, content));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return boardVOList;
    }

    /**
     * @see IBoardDAO#findOne(int bno)
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public BoardVO findOne(int bno) {
        ResultSet rs = null;
        BoardVO boardVO = new BoardVO(bno, null, null, null);

        try {
            Class.forName(DB_DRIVE_PATH);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER_ID, DB_USER_PASSWORD);
            PreparedStatement stmt = con.prepareStatement(Query.BOARD_READ);
            ) {
            stmt.setInt(1, bno);
            rs = stmt.executeQuery();

            while (rs.next()) {
                boardVO.setBno(rs.getInt("bno"));
                boardVO.setTitle(rs.getString("title"));
                boardVO.setWriter(rs.getString("writer"));
                boardVO.setContent(rs.getString("content"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return boardVO;
    }

    /**
     * @see IBoardDAO#createBoard()
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public void createBoard(BoardDTO board) {
        try {
            Class.forName(DB_DRIVE_PATH);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER_ID, DB_USER_PASSWORD);
            PreparedStatement stmt = con.prepareStatement(Query.BOARD_INSERT);
            ) {
            stmt.setInt(1, board.getBno());
            stmt.setString(2, board.getTitle());
            stmt.setString(3, board.getWriter());
            stmt.setString(4, board.getContent());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * @see IBoardDAO#deleteBoard()
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public void deleteBoard(int bno) {
        try {
            Class.forName(DB_DRIVE_PATH);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER_ID, DB_USER_PASSWORD);
            PreparedStatement stmt = con.prepareStatement(Query.BOARD_DELETE);
            ) {
            stmt.setInt(1, bno);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * @see IBoardDAO#updateBoard(BoardDTO board)
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public void updateBoard(BoardDTO board) {
        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER_ID, DB_USER_PASSWORD);
            PreparedStatement stmt = con.prepareStatement(Query.BOARD_UPDATE);
            ) {
            stmt.setString(1, board.getTitle());
            stmt.setString(2, board.getWriter());
            stmt.setString(3, board.getContent());
            stmt.setInt(4, board.getBno());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}