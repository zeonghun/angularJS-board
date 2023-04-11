package kr.ymtech.ojt.http_method.board.dto;

/**
 * 기존, 업데이트 정보 저장 클래스
 * 
 * @author zeonghun
 * @since 2023.04.11
 */
public class UpdateBoardResDTO {

    private BoardDTO old;
    private BoardDTO update;

    public BoardDTO getOld() {
        return old;
    }

    public BoardDTO getUpdate() {
        return update;
    }

    public void setOld(BoardDTO old) {
        this.old = old;
    }

    public void setUpdate(BoardDTO update) {
        this.update = update;
    }

    @Override
    public String toString() {
        return "UpdateBoardResDTO [old=" + old + ", update=" + update + "]";
    }
}
