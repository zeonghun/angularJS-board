package kr.ymtech.ojt.http_method.board.dao;

import java.util.List;

import kr.ymtech.ojt.http_method.board.dto.BoardDto;
import kr.ymtech.ojt.http_method.board.vo.BoardVo;
import open.commons.core.Result;

public interface IBoardDao {

    /**
     * 전체 게시물 조회
     * 
     * @return 전체 게시물
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    public Result<List<BoardVo>> findAll();

    /**
     * 게시물 조회
     * 
     * @param bno 조회할 게시물 번호
     * 
     * @return 조회 게시물
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    public Result<BoardVo> findOne(int bno);

    /**
     * 게시물 추가
     * 
     * @param board 추가할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    public Result<Integer> createBoard(BoardDto board);

    /**
     * 게시물 삭제
     * 
     * @param board 삭제할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    public Result<Integer> deleteBoard(int bno);

    /**
     * 게시물 수정UpdateBoardResDTO
     * 
     * @param board 수정할 게시물
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    public Result<Integer> updateBoard(BoardDto board);
}
