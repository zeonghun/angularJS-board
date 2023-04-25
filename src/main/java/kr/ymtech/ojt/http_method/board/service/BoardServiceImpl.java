package kr.ymtech.ojt.http_method.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.ymtech.ojt.http_method.board.dao.IBoardDao;
import kr.ymtech.ojt.http_method.board.dto.BoardDto;
import kr.ymtech.ojt.http_method.board.dto.UpdateBoardResDto;
import kr.ymtech.ojt.http_method.board.vo.BoardVo;
import open.commons.core.Result;

@Service
public class BoardServiceImpl implements IBoardService {

    @Autowired
    private IBoardDao dao;

    /**
     * @see IBoardService#findAll()
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public List<BoardDto> findAll() {
        List<BoardDto> boardDTOList = new ArrayList<>();
        Result<List<BoardVo>> boardVOList = dao.findAll();

        for (int i = 0; i < boardVOList.getData().size(); i++) {
            boardDTOList.add(new BoardDto(boardVOList.getData().get(i)));
        }
        return boardDTOList;
    }

    /**
     * @see IBoardService#findOne(int bno)
     *
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public BoardDto findOne(int bno) {
        BoardDto boardDTO = new BoardDto(bno, null, null, null);

        Result<BoardVo> boardVO = dao.findOne(bno);

        if (boardVO.getData() == null) {
            return null;
        } else {
            // VO -> DTO
            boardDTO.setBno(boardVO.getData().getBno());
            boardDTO.setTitle(boardVO.getData().getTitle());
            boardDTO.setWriter(boardVO.getData().getWriter());
            boardDTO.setContent(boardVO.getData().getContent());

            return boardDTO;
        }
    }

    /**
     * @see IBoardService#createBoard(BoardDto board)
     *
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public BoardDto createBoard(BoardDto board) {

        List<BoardDto> boardList = this.findAll();

        for (int i = 0; i < boardList.size(); i++) {

            // DB에 추가할 bno가 이미 존재하는 경우
            if (boardList.get(i).getBno() == board.getBno()) {
                return null;
            }
        }

        Result<Integer> result = dao.createBoard(board);

        // 게시물 추가 결과가 null이 아닌 경우
        if (result != null) {
            // 저장된 데이터 확인
            Result<BoardVo> vo = dao.findOne(board.getBno());
            board = new BoardDto(vo);
            return board;
        }
        return null;
    }

    /**
     * @see IBoardService#deleteBoard(int bno)
     *
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public BoardDto deleteBoard(int bno) {

        // 삭제 게시물 조회
        BoardDto boardDTO = this.findOne(bno);

        Result<Integer> result = dao.deleteBoard(bno);

        // 게시물 삭제 결과가 null이 아닌 경우
        if (result != null) {
            return boardDTO;
        }
        return null;
    }

    /**
     * @see IBoardService#updateBoard(BoardDto board)
     *
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public UpdateBoardResDto updateBoard(BoardDto board) {

        UpdateBoardResDto resDTO = new UpdateBoardResDto();

        // 기존 게시물 조회
        BoardDto boardDTO = this.findOne(board.getBno());

        // 기존 게시물 저장
        resDTO.setOld(boardDTO);

        Result<Integer> result = dao.updateBoard(board);

        // result.getData이 0이 아닌 경우
        if (result.getData() != 0) {

            // 수정 게시물 조회
            boardDTO = this.findOne(board.getBno());

            // 수정 게시물 저장
            resDTO.setUpdate(boardDTO);

            return resDTO;
        }
        return null;
    }
}