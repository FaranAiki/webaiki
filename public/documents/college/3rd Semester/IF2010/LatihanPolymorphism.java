class Slide {
  private static int last_no = 0;
  private int no = 0;
  private String title;
  private String content;
  protected String type = "notype";
  
  public Slide(String title, String content) {
    this.title = title;
    this.content = content;
    last_no++;
    no = last_no;
  }

  public int getNo() {
    return this.no;
  }

  public String getTitle() {
    return this.title;
  }

  public String getContent() {
    return this.content;
  }

  public String getType() { return type; }

  public void tulis() {
    System.out.println(String.format("[%s] - %s", getTitle(), getContent()));
  }

  public static int getLastSlideNumber() {
    return last_no;
  }
}

class OpeningSlide extends Slide {
  public OpeningSlide(String title, String context) {
    super(title, context);
    this.type = "opening";
  }

  @Override
  public void tulis() {
    System.out.println(String.format("(Startnow!) [%s] - %s", getTitle(), getContent()));
  }
}

class ClosingSlide extends Slide {
  public ClosingSlide(String title, String context) {
    super(title, context);
    this.type = "closing";
  }

  @Override
  public void tulis() {
    System.out.println(String.format("[%s] - %s (Selesai)", getTitle(), getContent()));
  }
}

class MateriSlide extends Slide {
  public MateriSlide(String title, String context) {
    super(title, context);
    this.type = "materi";
  }

  @Override
  public void tulis() {
    System.out.println(String.format("[%s] - %s (Materi, pahami ya!!)", getTitle(), getContent()));
  }
}

public class LatihanPolymorphism {
  public static void main(String[] args) {
    Slide[] daftar_slide = new Slide[6];

    daftar_slide[0] = new OpeningSlide("Pengenalan Tentang PBO", "Pemrograman Berbasis Objek adalah pemrograman dengan mindset semua adalah objek.");
    daftar_slide[1] = new MateriSlide("Tentang class", "Di sini kita akan belajar tentang class");
    daftar_slide[2] = new MateriSlide("Tentang interface", "Di sini kita akan belajar tentang interface"); 
    daftar_slide[3] = new MateriSlide("Tentang package", "Di sini kita akan belajar tentang package"); 
    daftar_slide[4] = new MateriSlide("Tentang enumeration", "Di sini kita akan belajar tentang enumeration"); 
    daftar_slide[5] = new ClosingSlide("Penutup", "Terima kasih!");

    // loop di sini
    for (Slide slide : daftar_slide) {
      System.out.println(String.format("Slide ke-%d: (tipe: %s)", slide.getNo(), slide.getType()));
      slide.tulis();
    }
  }
}
