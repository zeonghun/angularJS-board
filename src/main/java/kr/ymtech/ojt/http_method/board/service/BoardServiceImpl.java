package kr.ymtech.ojt.http_method.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import kr.ymtech.ojt.http_method.board.dao.IBoardDAO;
import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.vo.BoardVO;

@Service
public class BoardServiceImpl implements IBoardService {

    @Autowired
    private IBoardDAO dao;

    // /**
    // * 게시판 목록 리스트
    // *
    // * @author zeonghun
    // * @since 2023.04.11
    // */
    // public List<BoardDTO> boards = new ArrayList<>();
    // {
    // boards.add(new BoardDTO(1, "test", "관리자", "test 입니다."));
    // boards.add(new BoardDTO(2, "스프링 설명서", "익명1", "Spring 어떻게 쓰나요?"));
    // boards.add(new BoardDTO(3, "annotation 사용하기", "익명2", "@Controller 사용하기"));
    // boards.add(new BoardDTO(4, "스프링부트란 무엇인가", "김정훈", "자바 프레임워크"));
    // boards.add(new BoardDTO(5, "mysql과 mariadb의 차이", "홍길동", "차이가 무엇일까?"));
    // }

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
    public ResponseEntity<BoardDTO> createBoard(BoardDTO board){
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
        BoardDTO boardDTO = new BoardDTO(bno, null, null, null);

        dao.deleteBoard(bno);

        return new ResponseEntity<>(boardDTO, HttpStatus.OK);
    }

    /**
    * @see IBoardService#updateBoard(BoardDTO board)
    *
    * @author zeonghun
    * @since 2023.04.17
    */
    @Override
    public ResponseEntity<BoardDTO> updateBoard(BoardDTO board) {
        dao.updateBoard(board);

        return new ResponseEntity<>(board, HttpStatus.OK);
    }
}