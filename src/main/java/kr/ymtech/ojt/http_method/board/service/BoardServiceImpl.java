package kr.ymtech.ojt.http_method.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.ymtech.ojt.http_method.board.dao.IBoardDAO;
import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.dto.UpdateBoardResDTO;
import kr.ymtech.ojt.http_method.board.vo.BoardVO;

@Service
public class BoardServiceImpl implements IBoardService {

    @Autowired
    private IBoardDAO dao;

    /**
     * @see IBoardService#findAll()
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public List<BoardDTO> findAll() {
        List<BoardDTO> boardDTOList = new ArrayList<>();
        List<BoardVO> boardVOList = dao.findAll();

        for (int i = 0; i < boardVOList.size(); i++) {
            boardDTOList.add(new BoardDTO(boardVOList.get(i)));
        }
        return boardDTOList;
    }

    /**
     * @see IBoardService#findOne(int bno)
     *
     * @author zeonghun
     * @since 2023.04.20
     */
    @Override
    public BoardDTO findOne(int bno) {
        BoardDTO boardDTO = new BoardDTO(bno, null, null, null);

        BoardVO boardVO = dao.findOne(bno);
        
        if (boardVO == null) {
            return null;
        } else {
            // VO -> DTO
            boardDTO.setBno(boardVO.getBno());
            boardDTO.setTitle(boardVO.getTitle());
            boardDTO.setWriter(boardVO.getWriter());
            boardDTO.setContent(boardVO.getContent());

            return boardDTO;
        }
    }

    /**
     * @see IBoardService#createBoard(BoardDTO board)
     *
     * @author zeonghun
     * @since 2023.04.20
     */
    @Override
    public BoardDTO createBoard(BoardDTO board) {

        List<BoardDTO> boardList = this.findAll();

        for (int i = 0; i < boardList.size(); i++) {

            // DB에 추가할 bno가 이미 존재하는 경우
            if (boardList.get(i).getBno() == board.getBno()) {
                return null;
            }
        }

        int result = dao.createBoard(board);

        // 게시물 추가 결과가 1개 행인 경우
        if (result > 0) {
            // 저장된 데이터 확인
            BoardVO vo = dao.findOne(board.getBno());
            board = new BoardDTO(vo);
            return board;
        }
        return null;
    }

    /**
     * @see IBoardService#deleteBoard(int bno)
     *
     * @author zeonghun
     * @since 2023.04.20
     */
    @Override
    public BoardDTO deleteBoard(int bno) {

        // 삭제 게시물 조회
        BoardDTO boardDTO = this.findOne(bno);

        int result = dao.deleteBoard(bno);
        
        // 게시물 삭제 결과가 1개 행인 경우
        if (result > 0) {
            return boardDTO;
        }
        return null;
    }

    /**
     * @see IBoardService#updateBoard(BoardDTO board)
     *
     * @author zeonghun
     * @since 2023.04.20
     */
    @Override
    public UpdateBoardResDTO updateBoard(BoardDTO board) {

        UpdateBoardResDTO resDTO = new UpdateBoardResDTO();

        // 기존 게시물 조회
        BoardDTO boardDTO = this.findOne(board.getBno());

        // 기존 게시물 저장
        resDTO.setOld(boardDTO);

        int result = dao.updateBoard(board);

        // 게시물 수정 결과가 1개 행인 경우
        if (result > 0) {
            
            // 수정 게시물 조회
            boardDTO = this.findOne(board.getBno());

            // 수정 게시물 저장
            resDTO.setUpdate(boardDTO);

            return resDTO;
        }
        return null;
    }
}