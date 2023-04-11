package kr.ymtech.ojt.http_method.board.dto;

/**
 * 게시판 항목 저장 클래스
 * 
 * @author zeonghun
 * @since 2023.04.11
 */
public class BoardDTO {
    private int bno;
    private String title;
    private String writer;
    private String content;

    public BoardDTO(int bno, String title, String writer, String content) {
        this.bno = bno;
        this.title = title;
        this.writer = writer;
        this.content = content;
    }

    public int getBno() {
        return this.bno;
    }

    public void setBno(int bno) {
        this.bno = bno;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getWriter() {
        return this.writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}