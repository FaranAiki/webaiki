public class Orang {
    private String nama;
    public Orang(String nama) {
        this.nama = nama;
    }
    public String getName() {
        return this.nama;
    }
}

public class JaketOrganisasi {
   private String nama_pemilik;
   private Orang dipakai_oleh;
   private static int total_jaket;
  
   public JaketOrganisasi(String nama) {
      this.nama_pemilik = nama;
      total_jaket++;
   }

   public void setPemilik(String nama) {
      this.nama_pemilik = nama;
   }

   public String getPemilik() {
      return this.nama_pemilik;
   }

   public void dipakaiOleh(Orang orangnya) {
      this.dipakai_oleh = orangnya;
   }

   public boolean sedangDipakai() {
      if (dipakai_oleh != null) { return true; }
      return false;
   }

   public int totalJaket() {
      return this.total_jaket;
   }
}

public class JaketHimpunan extends JaketOrganisasi {
   private String namaHimpunan;

   public JaketHimpunan(String nama, String himpunan) {
     super(nama); 
     this.namaHimpunan = himpunan;
   }
}

public class JaketAngkatan extends JaketOrganisasi {
   private String namaAngkatan;

   public JaketAngkatan(String nama, String angkatan) {
     super(nama); 
     this.namaAngkatan = angkatan;
   } 
}

public class LatihanInterface {
    public static void main(String args[]) {
       Orang faran = new Orang("Faran Aiki");
       JaketAngkatan vertera = new JaketAngkatan("Faran Aiki", "Vertera");
       System.out.println("Jaket sedang dipakai: %b", vertera.sedangDipakai());
       vertera.dipakaiOleh(faran);
       System.out.println("Jaket sedang dipakai: %b", vertera.sedangDipakai());
    }
}
