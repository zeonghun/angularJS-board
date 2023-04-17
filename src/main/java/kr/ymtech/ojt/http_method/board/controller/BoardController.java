package kr.ymtech.ojt.http_method.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import kr.ymtech.ojt.http_method.board.service.IBoardService;

/**
 * 게시물 조회, 추가, 삭제, 수정
 * 
 * @author zeonghun
 * @since 2023.04.17
 */
@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired
    private IBoardService service;

    /**
     * 전체 게시물 출력
     * 
     * @return 전체 게시물 조회
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @GetMapping
    public List<BoardDTO> showAllBoards() {
        return service.findAll();
    }

    /**
     * 게시물 출력
     * 
     * @return 게시물 조회
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @GetMapping("/{bno}")
    public BoardDTO showBoards(@PathVariable int bno) {
        return service.findOne(bno);
    }

    /**
     * 게시물 추가
     * 
     * @return 추가 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @PostMapping
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO board) {
        return service.createBoard(board);
    }

    /**
     * 게시물 삭제
     * 
     * @return 삭제 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @DeleteMapping("/delete/{bno}")
    public ResponseEntity<BoardDTO> deleteBoard(@PathVariable int bno) {
        return service.deleteBoard(bno);
    }

    /**
     * 게시물 수정
     * 
     * @return 수정 게시물
     * 
     * @author zeonghun
     * @since 2023.04.17
     */
    @PatchMapping
    public ResponseEntity<UpdateBoardResDTO> updateBoard(@RequestBody BoardDTO board) {
        return service.updateBoard(board);
    }
}
