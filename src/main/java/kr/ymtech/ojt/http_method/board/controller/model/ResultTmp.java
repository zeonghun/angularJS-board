package kr.ymtech.ojt.http_method.board.controller.model;

public class ResultTmp<T> {
    
    private boolean result;
    private T data;
    private String message;


    public boolean isResult() {
        return result;
    }
    public T getData() {
        return data;
    }
    public String getMessage() {
        return message;
    }
    public void setResult(boolean result) {
        this.result = result;
    }
    public ResultTmp<T> setData(T data) {
        this.data = data;
        return this;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public void andTrue(){
        this.result = true;
    }

    public void andFalse(){
        this.result = false;
    }

    @Override
    public String toString() {
        return "ResultTmp [result=" + result + ", data=" + data + ", message=" + message + "]";
    }
}
