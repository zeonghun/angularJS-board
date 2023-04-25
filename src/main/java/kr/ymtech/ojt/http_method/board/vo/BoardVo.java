package kr.ymtech.ojt.http_method.board.vo;

import open.commons.core.annotation.ColumnDef;
import open.commons.core.annotation.ColumnValue;
import open.commons.core.annotation.Getter;
import open.commons.core.annotation.Setter;
import open.commons.core.database.annotation.TableDef;

/**
 * 게시물 항목 저장 클래스
 * 
 * @author zeonghun
 * @since 2023.04.25
 */
@TableDef(table = "board")
public class BoardVo {
    private int bno;
    private String title;
    private String writer;
    private String content;

    public BoardVo() {}

    public BoardVo(int bno, String title, String writer, String content) {
        this.bno = bno;
        this.title = title;
        this.writer = writer;
        this.content = content;
    }

    @ColumnValue(name = "bno", updatable = true)
    @Getter(name = "bno", type = Integer.class)
    public int getBno() {
        return this.bno;
    }

    @ColumnValue(name = "title", updatable = true)
    @Getter(name = "title", type = String.class)
    public String getTitle() {
        return this.title;
    }

    @ColumnValue(name = "writer", updatable = true)
    @Getter(name = "writer", type = String.class)
    public String getWriter() {
        return this.writer;
    }

    @ColumnValue(name = "content", updatable = true)
    @Getter(name = "content", type = String.class)
    public String getContent() {
        return this.content;
    }

    @ColumnDef(name = "bno", type = Integer.class, caseSensitive = false)
    @Setter(name = "bno", type = Integer.class)
    public void setBno(int bno) {
        this.bno = bno;
    }

    @ColumnDef(name = "title", type = String.class, caseSensitive = false)
    @Setter(name = "title", type = String.class)
    public void setTitle(String title) {
        this.title = title;
    }

    @ColumnDef(name = "writer", type = String.class, caseSensitive = false)
    @Setter(name = "writer", type = String.class)
    public void setWriter(String writer) {
        this.writer = writer;
    }

    @ColumnDef(name = "content", type = String.class)
    @Setter(name = "content", type = String.class)
    public void setContent(String content) {
        this.content = content;
    }
}
