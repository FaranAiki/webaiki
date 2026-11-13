class Orang {
    private String nama;
    public Orang(String nama) {
        this.nama = nama;
        System.out.println(String.format("Ada orang namanya %s", this.nama));
    }
    public String getName() {
        return this.nama;
    }
}

abstract class JaketOrganisasi {
   private String nama_pemilik;
   private Orang dipakai_oleh;
   private static int total_jaket;

   public abstract boolean jaketSahDipakai();

   public JaketOrganisasi(String nama) {
      this.nama_pemilik = nama;
      System.out.println(String.format("Jaket dengan pemilik %s dibuat", this.nama_pemilik));
      total_jaket++;
   }

   public final void setPemilik(String nama) {
      this.nama_pemilik = nama;
   }

   public final String getPemilik() {
      return this.nama_pemilik;
   }

   public final void dipakaiOleh(Orang orangnya) {
      this.dipakai_oleh = orangnya;
      System.out.println(String.format("Sekarang, jaket %s dipakai oleh %s", this.nama_pemilik, this.lagiDipakaiSiapa().getName()));
      if (!this.jaketSahDipakai()) {
          System.out.println("Padahal ga boleh!");
      }
   }

   public final Orang lagiDipakaiSiapa() {
      return this.dipakai_oleh;
   }

   public final boolean sedangDipakai() {
      if (dipakai_oleh != null) { return true; }
      return false;
   }

   public final static int totalJaket() {
      return JaketOrganisasi.total_jaket;
   }
}

class JaketHimpunan extends JaketOrganisasi {
   private String namaHimpunan;

   public JaketHimpunan(String nama, String himpunan) {
     super(nama); 
     this.namaHimpunan = himpunan;
     System.out.println(String.format("Ternyata ini jaket himpunan %s", this.namaHimpunan));
   }

   @Override
   public final boolean jaketSahDipakai() {
      if (this.lagiDipakaiSiapa().getName().equals(this.getPemilik())) {
          return true;
      }
      return false;
   }
}

class JaketAngkatan extends JaketOrganisasi {
   private String namaAngkatan;

   public JaketAngkatan(String nama, String angkatan) {
     super(nama); 
     this.namaAngkatan = angkatan;
     System.out.println(String.format("Ternyata ini jaket angkatan %s", this.namaAngkatan));
   }

   @Override
   public final boolean jaketSahDipakai() {
      return true;
   }
}

public class LatihanInheritance {
    public static void main(String args[]) {
       Orang faran = new Orang("Faran Aiki");
       JaketAngkatan vertera = new JaketAngkatan("Faran Aiki", "Vertera");
       System.out.println(String.format("Jaket sedang dipakai: %b", vertera.sedangDipakai()));
       vertera.dipakaiOleh(faran);
       System.out.println(String.format("Jaket sedang dipakai: %b", vertera.sedangDipakai()));
       System.out.println(JaketOrganisasi.totalJaket());

       Orang radit = new Orang("Radit");
       JaketHimpunan jaketnyaradit = new JaketHimpunan("Radit", "HMIF");
       jaketnyaradit.dipakaiOleh(radit);
       jaketnyaradit.dipakaiOleh(faran);
       System.out.println(JaketOrganisasi.totalJaket());
    }
}

