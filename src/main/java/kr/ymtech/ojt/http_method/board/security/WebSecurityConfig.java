package kr.ymtech.ojt.http_method.board.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;

import open.commons.spring.web.config.SpringfoxSwaggerWebSecurityCofigurer;

@Configuration
public class WebSecurityConfig extends SpringfoxSwaggerWebSecurityCofigurer {

    @Override
    public void configure(WebSecurity web) throws Exception {

        web.ignoring()
                .antMatchers("/static/**")
                .antMatchers("/register/**")
                .antMatchers("/test/**")
                //             .antMatchers("/open-api/**")
                //             .antMatchers("/api/**")
                .antMatchers("/login")
                .antMatchers("/error")
                .antMatchers("/boards/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http.csrf().disable().authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/login").permitAll()
                // 앞에서 설정한 이외의 모든 페이지는 로그인 필요
                .anyRequest().authenticated();
    }
}