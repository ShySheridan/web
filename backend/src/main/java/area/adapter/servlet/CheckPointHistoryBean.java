package area.adapter.servlet;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public final class CheckPointHistoryBean implements Serializable {
    private static final long serialVersionUID = 1L;
    private final List<PointResultBean> results = new ArrayList<>();

    public synchronized void add(PointResultBean result) {
        results.add(0, result);
    }

    public synchronized List<PointResultBean> getResults() {
        return List.copyOf(results);
    }
}
