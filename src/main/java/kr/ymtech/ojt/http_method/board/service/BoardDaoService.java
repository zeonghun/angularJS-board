package kr.ymtech.ojt.http_method.board.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;

@Service
public class BoardDaoService {

    /**
     * 게시판 목록 리스트
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    public List<BoardDTO> boards = new ArrayList<>();
    {
        boards.add(new BoardDTO(1, "test", "관리자", "test 입니다."));
        boards.add(new BoardDTO(2, "스프링 설명서", "익명1", "Spring 어떻게 쓰나요?"));
        boards.add(new BoardDTO(3, "annotation 사용하기", "익명2", "@Controller 사용하기"));
        boards.add(new BoardDTO(4, "스프링부트란 무엇인가", "김정훈", "자바 프레임워크"));
        boards.add(new BoardDTO(5, "mysql과 mariadb의 차이", "홍길동", "차이가 무엇일까?"));
    }

    /**
     * 게시판 전체 목록 조회
     * 
     * @return 게시판 목록 리스트
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    public List<BoardDTO> findAll() {
        return boards;
    }

    /**
     * 게시판 특정 목록 조회
     * 
     * @param bno 조회할 게시판 번호
     * 
     * @return 게시판 특정 목록
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    public BoardDTO findOne(int bno) {
        for (BoardDTO board : boards) {
            if (board.getBno() == bno) {
                return board;
            }
        }
        return null;
    }

    /**
     * 게시판 특정 목록 삭제
     * 
     * @param bno 삭제할 게시판 번호
     * 
     * @return 게시판 목록
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    public BoardDTO deleteById(int bno) {
        Iterator<BoardDTO> iterator = boards.iterator();
        // iterator 안에 다음 값이 들어있을 경우
        while (iterator.hasNext()) {
            // iterator의 다음 값 가져오기
            BoardDTO board = iterator.next();

            if (board.getBno() == bno) {
                iterator.remove();
                return board;
            }
        }
        return null;
    }
    
    /**
     * 게시판 목록 수정
     * 
     * @param num 수정할 게시판 번호
     * @param board 수정 내용
     * 
     * @author zeonghun
     * @since 2023.04.11
     */
    public void updateById(int num, BoardDTO board) {
        // 기존 게시판에 수정할 내용 저장
        boards.get(num).setTitle(board.getTitle());
        boards.get(num).setWriter(board.getWriter());
        boards.get(num).setContent(board.getContent());
    }
}