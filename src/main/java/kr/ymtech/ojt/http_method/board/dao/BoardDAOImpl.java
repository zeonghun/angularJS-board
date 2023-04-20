package kr.ymtech.ojt.http_method.board.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.query.Query;
import kr.ymtech.ojt.http_method.board.vo.BoardVO;

/**
 * DB 연동 모듈
 * 
 * @author zeonghun
 * @since 2023.04.19
 */
@Repository
public class BoardDAOImpl implements IBoardDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * @see IBoardDAO#findAll()
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @Override
    public List<BoardVO> findAll() {
        List<BoardVO> boardVOList = jdbcTemplate.query(
                Query.BOARD_READ_ALL,
                (rs, count) -> new BoardVO(rs.getInt("bno"),
                        rs.getString("title"),
                        rs.getString("writer"),
                        rs.getString("content")));

        return boardVOList;
    }

    /**
     * @see IBoardDAO#findOne(int bno)
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @Override
    public BoardVO findOne(int bno) {
        BoardVO boardVO = jdbcTemplate.queryForObject(
                Query.BOARD_READ,
                (rs, count) -> new BoardVO(rs.getInt("bno"),
                        rs.getString("title"),
                        rs.getString("writer"),
                        rs.getString("content")),
                bno);

        return boardVO;
    }

    /**
     * @see IBoardDAO#createBoard()
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @Override
    public int createBoard(BoardDTO board) {
        int result = jdbcTemplate.update(
                Query.BOARD_INSERT,
                board.getBno(), board.getTitle(), board.getWriter(), board.getContent());
        return result;
    }

    /**
     * @see IBoardDAO#deleteBoard()
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @Override
    public int deleteBoard(int bno) {
        int result = jdbcTemplate.update(
                Query.BOARD_DELETE,
                bno);
        return result;
    }

    /**
     * @see IBoardDAO#updateBoard(BoardDTO board)
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    public int updateBoard(BoardDTO board) {
        int result = jdbcTemplate.update(
                Query.BOARD_UPDATE,
                board.getTitle(), board.getWriter(), board.getContent(), board.getBno());
        return result;
    }
}