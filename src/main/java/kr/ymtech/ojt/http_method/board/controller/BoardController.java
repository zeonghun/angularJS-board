package kr.ymtech.ojt.http_method.board.controller;

import java.util.List;

import javax.validation.Valid;

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

import kr.ymtech.ojt.http_method.board.dto.BoardDto;
import kr.ymtech.ojt.http_method.board.dto.UpdateBoardResDto;
import kr.ymtech.ojt.http_method.board.service.IBoardService;

/**
 * 게시물 조회, 추가, 삭제, 수정
 * 
 * @author zeonghun
 * @since 2023.04.19
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
    public List<BoardDto> showAllBoards() {

        return service.findAll();
    }

    /**
     * 게시물 출력
     * 
     * @return 게시물 조회
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @GetMapping("/{bno}")
    public ResponseEntity<BoardDto> showBoards(@PathVariable int bno) {

        BoardDto result = service.findOne(bno);

        if (result == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 게시물 추가
     * 
     * @return 추가 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @PostMapping
    public ResponseEntity<BoardDto> createBoard(@RequestBody @Valid BoardDto board) {

        BoardDto result = service.createBoard(board);

        if (result == null) {
            return new ResponseEntity<BoardDto>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 게시물 삭제
     * 
     * @return 삭제 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @DeleteMapping("/delete/{bno}")
    public ResponseEntity<BoardDto> deleteBoard(@PathVariable int bno) {

        BoardDto result = service.deleteBoard(bno);

        if (result == null) {
            return new ResponseEntity<BoardDto>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 게시물 수정
     * 
     * @return 수정 게시물
     * 
     * @author zeonghun
     * @since 2023.04.19
     */
    @PatchMapping
    public ResponseEntity<UpdateBoardResDto> updateBoard(@RequestBody @Valid BoardDto board) {

        UpdateBoardResDto result = service.updateBoard(board);

        if (result == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
