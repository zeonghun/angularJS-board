package kr.ymtech.ojt.http_method.board.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.ymtech.ojt.http_method.board.dto.BoardDto;
import kr.ymtech.ojt.http_method.board.vo.BoardVo;
import open.commons.core.Result;
import open.commons.core.function.SQLConsumer;

/**
 * DB 연동 모듈
 * 
 * @author zeonghun
 * @since 2023.04.25
 */
@Repository
public class BoardDaoImpl extends AbstractMariadbDao<BoardVo> implements IBoardDao {
    
    public BoardDaoImpl() {
        super(BoardVo.class);
    }

    /**
     * @see IBoardDao#findAll()
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public Result<List<BoardVo>> findAll() {
        String query = getQuery("boardDao.select.all");
        
        if (logger.isDebugEnabled()) {
            logger.debug("Query: " + query);
            logger.info("Parameters: null");
        }
        
        return getList(query, SQLConsumer.setParameters(), BoardVo.class);
    }

    /**
     * @see IBoardDao#findOne(int bno)
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public Result<BoardVo> findOne(int bno) {
        String query = getQuery("boardDao.select.by.bno");

        if (logger.isDebugEnabled()) {
            logger.debug("Query: " + query);
            logger.info("Parameters: " + bno);
        }
        
        return getObject(query, SQLConsumer.setParameters(bno), BoardVo.class);
    }

    /**
     * @see IBoardDao#createBoard()
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public Result<Integer> createBoard(BoardDto board) {
        String query = getQuery("boardDao.insert");

        if (logger.isDebugEnabled()) {
            logger.debug("Query: " + query);
            logger.info("Parameters: ", String.join(", ", board.getTitle(),board.getWriter(), board.getContent()));
        }
        
        return executeUpdate(query, SQLConsumer.setParameters(
                new Object[] {board.getTitle(), board.getWriter(), board.getContent()}));
    }

    /**
     * @see IBoardDao#deleteBoard()
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public Result<Integer> deleteBoard(int bno) {
        String query = getQuery("boardDao.delete");

        if (logger.isDebugEnabled()) {
            logger.debug("Query: " + query);
            logger.info("Parameters: " + bno);
        }
    
        return executeUpdate(query, SQLConsumer.setParameters(bno));
    }

    /**
     * @see IBoardDao#updateBoard(BoardDto board)
     * 
     * @author zeonghun
     * @since 2023.04.25
     */
    @Override
    public Result<Integer> updateBoard(BoardDto board) {
        String query = getQuery("boardDao.update");
        
        if (logger.isDebugEnabled()) {
            logger.debug("Query: " + query);
            logger.info("Parameters: ", String.join(", ", board.getTitle(), board.getWriter(), board.getContent(), String.valueOf(board.getBno())));
        }

        return executeUpdate(query, SQLConsumer.setParameters(
                new Object[] { board.getTitle(), board.getWriter(), board.getContent(), board.getBno()}));
    }
}