package kr.ymtech.ojt.http_method.board.vo;

/**
 * 기존, 업데이트 정보 저장 클래스
 * 
 * @author zeonghun
 * @since 2023.04.17
 */
public class UpdateBoardResVO {
    private BoardVO old;
    private BoardVO update;

    public BoardVO getOld() {
        return old;
    }

    public BoardVO getUpdate() {
        return update;
    }

    public void setOld(BoardVO old) {
        this.old = old;
    }

    public void setUpdate(BoardVO update) {
        this.update = update;
    }

    @Override
    public String toString() {
        return "UpdateBoardResVO [old=" + old + ", update=" + update + "]";
    }
}