package kr.ymtech.ojt.http_method.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;
import kr.ymtech.ojt.http_method.board.dto.UpdateBoardResDTO;
import kr.ymtech.ojt.http_method.board.service.ImPL.BoardDaoService;

/**
 * 게시판 목록 출력
 * 
 * @author zeonghun
 * @since 2023.04.11
 */
@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired
    private BoardDaoService service;

    /**
     * 게시판 전체 목록 출력
     * 
     * @return 게시판 전체 목록 조회
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    @GetMapping
    public List<BoardDTO> showAllBoards() {
        return service.findAll();
    }

    /**
     * 게시판 특정 목록 출력
     * 
     * @return 게시판 특정 목록 조회
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    @GetMapping("/{bno}")
    public BoardDTO showBoards(@PathVariable int bno) {
        return service.findOne(bno);
    }

    /**
     * 게시판 목록 추가
     * 
     * @return 추가 목록
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    @PostMapping
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO board) {
        List<BoardDTO> boardList = service.findAll();

        for (int i = 0; i < boardList.size(); i++) {
            if (boardList.get(i).getBno() == board.getBno()) {
                return ResponseEntity.badRequest().build();
            }
        }
        service.boards.add(board);

        return new ResponseEntity<>(board, HttpStatus.OK);
    }

    /**
     * 게시판 목록 삭제
     * 
     * @return 게시판 목록 삭제
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    @DeleteMapping("/delete/{bno}")
    public ResponseEntity<BoardDTO> deleteBoard(@PathVariable int bno) {
        List<BoardDTO> boardList = service.findAll();
        BoardDTO boardDto = new BoardDTO(bno, null, null, null);

        for (int i = 0; i < boardList.size(); i++) {
            if (boardList.get(i).getBno() == bno) {
                boardDto = boardList.get(i);
                service.deleteById(bno);

                return new ResponseEntity<>(boardDto, HttpStatus.OK);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 게시판 목록 수정
     * 
     * @return 게시판 목록 수정
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    @PatchMapping
    public ResponseEntity<UpdateBoardResDTO> updateBoard(@RequestBody BoardDTO board) {

        UpdateBoardResDTO resDto = new UpdateBoardResDTO();

        List<BoardDTO> boardList = service.findAll();
        int num = -1;

        for (int i = 0; i < boardList.size(); i++) {
            // 게시판 전체 목록중에 수정할 게시판 번호가 있는 경우
            if (boardList.get(i).getBno() == board.getBno()) {
                num = i;
                break;
            }
        }
        // 수정할 게시판 번호가 없는 경우
        if (num == -1) {
            return ResponseEntity.badRequest().build();
        }

        // bno가 num인 게시판 객체 생성
        BoardDTO dto = boardList.get(num);
        BoardDTO old = new BoardDTO(dto.getBno(), dto.getTitle(), dto.getWriter(), dto.getContent());

        // // bno가 num인 게시판 객체 생성
        // BoardDTO old = new BoardDTO(boardList.get(num).getBno(),
        // boardList.get(num).getTitle(),
        // boardList.get(num).getWriter(), boardList.get(num).getContent());

        // 기존 게시판 저장
        resDto.setOld(old);

        // 수정할 게시판 저장
        resDto.setUpdate(board);

        // 게시판 목록 수정
        service.updateById(num, board);

        return new ResponseEntity<>(resDto, HttpStatus.OK);
    }
}
