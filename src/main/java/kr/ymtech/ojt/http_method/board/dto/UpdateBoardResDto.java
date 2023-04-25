package kr.ymtech.ojt.http_method.board.dto;

/**
 * 기존, 업데이트 정보 저장 클래스
 * 
 * @author zeonghun
 * @since 2023.04.17
 */
public class UpdateBoardResDto {

    private BoardDto old;
    private BoardDto update;

    public BoardDto getOld() {
        return old;
    }

    public BoardDto getUpdate() {
        return update;
    }

    public void setOld(BoardDto old) {
        this.old = old;
    }

    public void setUpdate(BoardDto update) {
        this.update = update;
    }

    @Override
    public String toString() {
        return "UpdateBoardResDTO [old=" + old + ", update=" + update + "]";
    }
}
