package kr.ymtech.ojt.http_method.board.dao;

import javax.sql.DataSource;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

import kr.ymtech.ojt.http_method.board.config.DatasourceConfig;
import open.commons.spring.jdbc.repository.mariadb.AbstractMariadbSingleDataSourceRepository;

public abstract class AbstractMariadbDao<T> extends AbstractMariadbSingleDataSourceRepository<T> {
    
    public AbstractMariadbDao(@NotNull Class<T> entityType) {
        super(entityType);
    }

    @Autowired
    @Qualifier(DatasourceConfig.DATA_SOURCE_MARIADB)
    @Override
    public void setDataSource(@NotNull DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Autowired
    @Qualifier(DatasourceConfig.QUERY_SOURCE)
    @Override
    public void setQuerySource(@NotNull ReloadableResourceBundleMessageSource querySource) {
        this.querySource = querySource;
    }
}
