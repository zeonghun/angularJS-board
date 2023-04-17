package kr.ymtech.ojt.http_method.board.dao;

import java.util.List;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.vo.BoardVO;

public interface IBoardDAO {
    
    /**
     * 전체 게시물 조회
     * 
     * @return 전체 게시물 리스트
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public List<BoardVO> findAll();

    /**
     * 특정 게시물 조회
     * 
     * @param bno 조회할 게시물 번호
     * 
     * @return 특정 게시물 객체
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public BoardVO findOne(int bno);

    /**
     * 게시물 추가
     * 
     * @param board 추가할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public void createBoard(BoardDTO board);

    /**
     * 게시물 삭제
     * 
     * @param board 삭제할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public void deleteBoard(int bno);

    /**
     * 게시물 수정
     * 
     * @param board 수정할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public void updateBoard(BoardDTO board);
}
