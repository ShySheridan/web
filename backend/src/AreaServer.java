import java.time.Clock;
import java.util.Map;

public final class AreaServer {
    public static void main(String[] args) {
        var check = new CheckPointHandler(new PointForm());
        var router = new Router(Map.of("/fcgi-bin/check", Map.of("POST", check)));
        var responses = new JsonResponses(Clock.systemUTC());
        new FastCgiAdapter(router, responses, System.err).run();
    }
}
