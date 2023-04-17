package kr.ymtech.ojt.http_method.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     * @since 2023.04.17
     */
    @Override
    public BoardDTO findOne(int bno) {
        BoardDTO boardDTO = new BoardDTO(bno, null, null, null);
        BoardVO boardVO = dao.findOne(bno);

        boardDTO.setBno(boardVO.getBno());
        boardDTO.setTitle(boardVO.getTitle());
        boardDTO.setWriter(boardVO.getWriter());
        boardDTO.setContent(boardVO.getContent());

        return boardDTO;
    }

    /**
     * @see IBoardService#createBoard(BoardDTO board)
     *
     * @author zeonghun
     * @since 2023.04.17
     */
    public ResponseEntity<BoardDTO> createBoard(BoardDTO board) {
        List<BoardDTO> boardList = this.findAll();

        for (int i = 0; i < boardList.size(); i++) {
            if (boardList.get(i).getBno() == board.getBno()) {
                return ResponseEntity.badRequest().build();
            }
        }
        dao.createBoard(board);

        return new ResponseEntity<>(board, HttpStatus.OK);
    }

    /**
     * @see IBoardService#deleteBoard(int bno)
     *
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public ResponseEntity<BoardDTO> deleteBoard(int bno) {
        List<BoardDTO> boardList = this.findAll();
        BoardDTO boardDTO = new BoardDTO(bno, null, null, null);

        for (int i = 0; i < boardList.size(); i++) {
            if (boardList.get(i).getBno() == bno) {
                boardDTO = boardList.get(i);
                dao.deleteBoard(bno);

                return new ResponseEntity<>(boardDTO, HttpStatus.OK);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * @see IBoardService#updateBoard(BoardDTO board)
     *
     * @author zeonghun
     * @since 2023.04.17
     */
    @Override
    public ResponseEntity<UpdateBoardResDTO> updateBoard(BoardDTO board) {
        List<BoardDTO> boardList = this.findAll();
        UpdateBoardResDTO resDTO = new UpdateBoardResDTO();
        int num = -1;

        for (int i = 0; i < boardList.size(); i++) {
            // 게시물 전체중에 수정할 게시물 번호가 있는 경우
            if (boardList.get(i).getBno() == board.getBno()) {
                num = i;
                break;
            }
        }

        // 수정할 게시물 번호가 없는 경우
        if (num == -1) {
            return ResponseEntity.badRequest().build();
        }

        // bno가 num인 게시물 객체 생성
        BoardDTO dto = boardList.get(num);
        BoardDTO old = new BoardDTO(dto.getBno(), dto.getTitle(), dto.getWriter(), dto.getContent());

        // 기존 게시물 저장
        resDTO.setOld(old);

        // 수정 게시물 저장
        resDTO.setUpdate(board);

        // 게시물 수정
        dao.updateBoard(board);

        return new ResponseEntity<>(resDTO, HttpStatus.OK);
    }
}