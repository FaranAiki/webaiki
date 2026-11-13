// bahasa ngetik apa ini tolonggggggggggggggggggggggg
public class kelas_sederhana {
    public class Hubungan {
        private boolean sudah_menikah;

        public void nikah() {
            this.sudah_menikah = true;
        }

        public void cerai() {
            this.sudah_menikah = false;
        }

        public boolean is_menikah() {
            return this.sudah_menikah;
        }

        public Hubungan() {
            this.sudah_menikah = false;
        }
    }

    public class Orang {
        public String nama;
        private int age;
        private Hubungan hubungan;
    }

    public class Mahasiswa extends Orang {
        private Integer nim;
        public String jurusan;
    }
}
