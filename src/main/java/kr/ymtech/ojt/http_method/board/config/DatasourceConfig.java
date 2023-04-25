package kr.ymtech.ojt.http_method.board.config;
import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatasourceConfig {

    // MariaDB
    public static final String DATA_SOURCE_MARIADB = "mariadb.datasource";
    public static final String QUERY_SOURCE = "messagesource";

    public DatasourceConfig() {
    }

    @Bean(name = DATA_SOURCE_MARIADB)
    @ConfigurationProperties("spring.datasource.mariadb")
    public DataSource getMariadbDatasource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = QUERY_SOURCE)
    @ConfigurationProperties("spring.messagesource")
    public ReloadableResourceBundleMessageSource getQuerySource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        return messageSource;
    }
}