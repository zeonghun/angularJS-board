package kr.ymtech.ojt.http_method.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
    @RequestMapping("/")
    public ModelAndView showBoard() {
        return new ModelAndView("main");
    }

    // @RequestMapping("/insertForm")
    // public ModelAndView insertFormView() {
    //     return new ModelAndView("insertForm");
    // }

    // @RequestMapping("/updateForm")
    // public ModelAndView updateFormView() {
    //     return new ModelAndView("updateForm");
    // }
}