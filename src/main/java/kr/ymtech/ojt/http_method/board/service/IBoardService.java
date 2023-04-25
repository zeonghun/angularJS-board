package kr.ymtech.ojt.http_method.board.service;

import java.util.List;

import kr.ymtech.ojt.http_method.board.dto.BoardDto;
import kr.ymtech.ojt.http_method.board.dto.UpdateBoardResDto;

public interface IBoardService {

    /**
     * 전체 게시물 조회
     * 
     * @return 전체 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    public List<BoardDto> findAll();

    /**
     * 게시물 조회
     * 
     * @param bno 조회할 게시물 번호
     * 
     * @return 조회 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    public BoardDto findOne(int bno);

    /**
     * 게시물 추가
     * 
     * @param board 추가할 게시물
     * 
     * @return 추가 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    public BoardDto createBoard(BoardDto board);

    /**
     * 게시물 삭제
     * 
     * @param bno 삭제할 게시물 번호
     * 
     * @return 삭제 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    public BoardDto deleteBoard(int bno);

    /**
     * 게시물 수정
     * 
     * @param bno 수정할 게시물 번호
     * 
     * @return 수정 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    public UpdateBoardResDto updateBoard(BoardDto board);
}
