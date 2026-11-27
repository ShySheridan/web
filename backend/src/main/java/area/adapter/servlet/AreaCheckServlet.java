package area.adapter.servlet;

import area.application.CheckPointCommand;
import area.application.CheckPointResult;
import area.application.CheckPointService;
import area.application.CheckPointValidationException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@WebServlet(name = "AreaCheckServlet")
public final class AreaCheckServlet extends HttpServlet {
    private final CheckPointService service = new CheckPointService();
    private final CheckPointRequestParser requestParser = new CheckPointRequestParser();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        long started = System.nanoTime();
        try {
            CheckPointCommand command = requestParser.parse(request);
            CheckPointResult result = service.check(command);
            long elapsed = System.nanoTime() - started;
            PointResultBean entry = new PointResultBean(
                    UUID.randomUUID().toString(), result.point().x().toPlainString(),
                    result.point().y().toPlainString(), result.point().r(), result.hit(),
                    Instant.now().toString(), elapsed);
            history(request).add(entry);
            request.setAttribute("result", entry);
            request.getRequestDispatcher("/WEB-INF/views/result.jsp").forward(request, response);
        } catch (IllegalArgumentException | CheckPointValidationException error) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            request.setAttribute("errorMessage", error.getMessage());
            request.setAttribute("xValue", request.getParameter("x"));
            request.setAttribute("yValue", request.getParameter("y"));
            String[] radii = request.getParameterValues("r");
            request.setAttribute("rValue", radii != null && radii.length == 1 ? radii[0] : null);
            request.getRequestDispatcher("/WEB-INF/views/index.jsp").forward(request, response);
        }
    }

    private CheckPointHistoryBean history(HttpServletRequest request) {
        return (CheckPointHistoryBean) request.getSession().getAttribute("checkPointHistory");
    }
}
