package area.adapter.servlet;

import java.io.Serializable;

public final class PointResultBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String x;
    private String y;
    private int r;
    private boolean hit;
    private String timestamp;
    private long elapsedNanos;

    public PointResultBean() {}

    public PointResultBean(String id, String x, String y, int r, boolean hit,
                           String timestamp, long elapsedNanos) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = timestamp;
        this.elapsedNanos = elapsedNanos;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getX() { return x; }
    public void setX(String x) { this.x = x; }
    public String getY() { return y; }
    public void setY(String y) { this.y = y; }
    public int getR() { return r; }
    public void setR(int r) { this.r = r; }
    public boolean isHit() { return hit; }
    public void setHit(boolean hit) { this.hit = hit; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public long getElapsedNanos() { return elapsedNanos; }
    public void setElapsedNanos(long elapsedNanos) { this.elapsedNanos = elapsedNanos; }
}
