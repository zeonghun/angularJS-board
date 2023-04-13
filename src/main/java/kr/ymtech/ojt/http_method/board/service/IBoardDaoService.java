package kr.ymtech.ojt.http_method.board.service;

import java.util.List;

import kr.ymtech.ojt.http_method.board.dto.BoardDTO;

public interface IBoardDaoService {

    // 게시판 전체 목록 조회
    public List<BoardDTO> findALL();

    // 게시판 특정 목록 조회
    public List<BoardDTO> findOne();

    // 게시판 특정 목록 삭제
    public BoardDTO deleteById(int bno);

    // 게시판 목록 수정
    public void updateById(int num, BoardDTO board);
}
