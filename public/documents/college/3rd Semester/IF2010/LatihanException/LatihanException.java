import java.util.Scanner;
import java.util.ArrayList;

/* Ini buat latihan ngebuat exception baru. Ternyata emg sesederhana itu kek enum */
class AngkaNegatifException extends Exception {
    public AngkaNegatifException(String message) {
        super(message);
    }
}

class AngkaNolException extends Exception {
    public AngkaNolException(String message) {
        super(message);
    }
}

/* ArrayList */
class NyariDivision {
  public static ArrayList<Long> dari(Long angka) {
    ArrayList<Long> arr = new ArrayList<>();
    for (long pembagi = 1; pembagi <= angka; pembagi++) {
      if (angka % pembagi == 0) arr.add(pembagi);
    }
    return arr;
  } 
}

class ReadUserHandler {
  private Scanner scanner; 
  private ArrayList<Long> jawabanAkhir;

  public ReadUserHandler() {
    this.scanner = new Scanner(System.in);
    this.jawabanAkhir = null;
  }

  public void read() {
    this.jawabanAkhir = null;
    System.out.print("Kira-kira mau nyari faktor dari apa aja ni: ");
    String input = scanner.nextLine();
    try {
      long besar = Long.parseLong(input);
      if (besar == 0) {
        throw new AngkaNolException("Angkanya nol, jadi pembaginya ada buanyakkkk (tak hingga)");
      } else if (besar < 0) {
        throw new AngkaNegatifException("Angka negatif oi!");
      }

      System.out.print("Oke, faktornya adalah: ");
      jawabanAkhir = NyariDivision.dari(besar);
    } catch (NumberFormatException e) {
      System.out.println("Eh? Coba cek lagi kira-kira itu angkanya benar atau tidak. Soalnya: " + e);
    } catch (Exception e) {
      System.out.println("Ada exception lain ni: "+ e);
    }
  }

  public void print() {
    if (this.jawabanAkhir == null) return;
    for (Long l: this.jawabanAkhir) {
      System.out.print(l +" ");
    }
    System.out.println("");
  }

}

public class LatihanException {
  public static void main(String args[]) {
    ReadUserHandler ru = new ReadUserHandler();
    for (int i = 0; i < 5; i++) {
      ru.read();
      ru.print();
    }
  }
}
