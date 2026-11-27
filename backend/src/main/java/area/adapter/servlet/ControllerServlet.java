package area.adapter.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/controller")
public final class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        route(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        route(request, response);
    }

    private void route(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ensureHistory(request);
        if (request.getParameter("x") != null || request.getParameter("y") != null
                || request.getParameter("r") != null) {
            request.getServletContext().getNamedDispatcher("AreaCheckServlet").forward(request, response);
            return;
        }
        request.getRequestDispatcher("/WEB-INF/views/index.jsp").forward(request, response);
    }

    private void ensureHistory(HttpServletRequest request) {
        var session = request.getSession(true);
        if (session.getAttribute("checkPointHistory") == null) {
            session.setAttribute("checkPointHistory", new CheckPointHistoryBean());
        }
    }
}
