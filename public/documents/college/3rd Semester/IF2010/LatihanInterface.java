// ini sengaja tidak di-public karena saya mau ngedit di satu file saja daripada banyak file 
// soalnya kalo dibuat public semua jadi ada banyak file 

interface TwoDimension {
  double PI = Math.PI;
  public double getArea();
}

// pake default karena kita membandingkan kebesaran dengan getArea yang sudah 
// ada di kontrak TwoDimension
interface Relatable extends TwoDimension {
  default public boolean isLargerThan(Relatable other) {
    return this.getArea() >= other.getArea();  
  }

  default public Relatable findLargest(Relatable other) {
    if (this.getArea() > other.getArea()) {
      return this;
    }
    return other;
  }
}

class Point {
  private int x, y;
  public void setX(int x) {
    this.x = x;
  }
  public void setY(int y) {
    this.y = y;
  }
  public int getX() { return this.x; } 
  public int getY() { return this.y; }

  public Point() {
    this(0,0);
  }

  public Point(int x, int y) {
    this.x = x;
    this.y = y;
    System.out.println(String.format("Point(%d, %d) dibuat", this.x, this.y));
  }

  public void move(int x, int y) {
    this.setX(x); this.setY(y);
  }

  @Override
  public String toString() {
    return String.format("Point(%d, %d)", this.getX(), this.getY());
  }
}

class RectanglePlus implements Relatable {
  private int width = 0;
  private int height = 0;
  private Point origin;

  public RectanglePlus() {
    this(new Point());  
  }

  public RectanglePlus(Point p) {
    this(p, 0, 0);
  }

  public RectanglePlus(int w, int h) {
    this(new Point(), w, h);
  }

  public RectanglePlus(Point p, int w, int h) {
    this.origin = p;
    this.setWidth(w);
    this.setHeight(h);
    System.out.println(String.format("RectanglePlus dibuat dengan %s, width: %d, height: %d", this.origin, this.width, this.height));
  }

  public double getArea() {
    return this.getWidth() * this.getHeight();
  }

  public int getWidth() { return this.width; } 
  public int getHeight() { return this.height; }

  public void setWidth(int width) {
    System.out.println(String.format("Mari kita setting %s dengan width=%d", this, width));
    if (width < 0) {
      throw new IllegalArgumentException("Width tidak boleh negatif");
    }
    this.width = width;
  }

  public void setHeight(int height) {
    System.out.println(String.format("Mari kita setting %s dengan height=%d", this, height));
    if (height < 0) {
      throw new IllegalArgumentException("Height tidak boleh negatif");
    }
    this.height = height;
  }

  @Override
  public String toString() {
    return String.format("RectanglePlus(%s, width=%d, height=%d)", this.origin, this.getWidth(), this.getHeight());
  }
}

class CirclePlus implements Relatable {
  private int radius = 0;
  private Point origin;

  public CirclePlus() {
    this(0);
  }

  public CirclePlus(int r) {
    this(new Point(0, 0), r);
  }

  public CirclePlus(Point p, int r) {
    this.origin = p;
    this.setRadius(r);
  }

  public void setRadius(int radius) {
    System.out.println(String.format("Mari kita setting %s dengan radius=%d", this, radius));
    if (radius < 0) {
      throw new IllegalArgumentException("Radius tidak boleh negatif");
    }
    this.radius = radius;
  }

  public int getRadius() { return this.radius; }

  public double getArea() {
    return this.getRadius() * this.getRadius() * TwoDimension.PI;
  }

  @Override
  public String toString() {
    return String.format("CirclePlus(%s, radius=%d)", this.origin, this.getRadius());
  }
}

public class LatihanInterface {
  public static void main(String[] arg) {
    RectanglePlus rp = new RectanglePlus(10, 10);
    RectanglePlus rp2 = new RectanglePlus(20, 20);
    if (rp.isLargerThan(rp2)) {
      System.out.println(String.format(":: Ternyata %s lebih besar daripada %s", rp, rp2));
    } else {
      System.out.println(String.format(":: Ternyata %s lebih besar daripada %s", rp2, rp));
    }
    try { rp.setHeight(-1); } catch (Exception e) {
      System.out.println(String.format("!! %s", e));
    }
    CirclePlus cc = new CirclePlus(10);
    if (cc.isLargerThan(rp2)) {
      System.out.println(String.format(":: Ternyata %s lebih besar daripada %s", cc, rp2));
    } else {
      System.out.println(String.format(":: Ternyata %s lebih besar daripada %s", rp2, cc));
    }
    CirclePlus cc2 = new CirclePlus(420);
    System.out.println(String.format(":: Dan, yang paling besar di antara mereka adalah... %s",
          rp.findLargest(rp2.findLargest(cc.findLargest(cc2)))));
  }
}
