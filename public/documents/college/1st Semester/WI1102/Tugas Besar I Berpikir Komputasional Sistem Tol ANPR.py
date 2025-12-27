#!/bin/python3

# Tidak perlu mengimpor pustaka apa pun
# karena terlalu overkill
# (tapi bisa pakai regex sebenarnya)

"""
Kelompok "3FC", Kelas 33

Kode untuk menyimulasikan secara menyeluruh
sistem ANPR dengan awal-awal mengonfigurasi
pembayaran dan plat yang terdaftar
"""

# Awalnya, tidak ada plat yang teregistrasi
# Format plat harus 
# H AAA HHH atau HH AAA HHH 
# dengan H huruf dan A angka
PLAT_MOBIL_REGISTERED: list[str] = []

# Harga default, bisa diubah melalui menu
# yang ada pada kondisi_tol()
HARGA_GERBANG_1 : int = 5000
HARGA_GERBANG_2 : int = 7000

# Ini agar format plat seragam
def validasi_format_plat(plat_str: str) -> bool:
    """
    Memvalidasi format plat [A|AA] 1234 XYZ tanpa regex karena terlalu overkill.
    Plat string sudah di .upper() dan .strip() agar 
    terjadi standardisasi yaitu menghapus spasi di kiri dan kanan serta 
    huruf-hurufnya sudah menjadi lebih besar
    """
    parts = plat_str.split(' ')

    # 1. Harus ada 3 bagian (dipisah spasi)
    # karena bentuknya HH AAA HHHH
    if len(parts) != 3:
        return False
    
    part1 = parts[0] # [A|AA]
    part2 = parts[1] # 1234
    part3 = parts[2] # XYZ

    if not (part1.isalpha() and 1 <= len(part1) <= 2):
        return False
    
    if not (part2.isdigit() and len(part2) == 4):
        return False
    
    if not (part3.isalpha() and len(part3) == 3):
        return False
        
    return True

# Fungsi untuk konfigurasi kondisi tol
# Akan digunakan return value bool 
# untuk mempermudah penanganan keluar dari kasus 
def kondisi_tol() -> bool:
    # global itu keyword dari Python agar ketika 
    # kita mengganti nilai lokal di sini, nilai di global (atas) juga terganti
    global PLAT_MOBIL_REGISTERED, HARGA_GERBANG_1, HARGA_GERBANG_2

    print("""\nMenu Konfigurasi Tol\n
Menu pilihan:
1. Tambahkan atau kurangi plat yang teregistrasi
2. Ganti harga gerbang untuk mobil kurang dari atau sama dengan 2.5 meter (Gerbang 1)
3. Ganti harga gerbang untuk mobil lebih besar daripada 2.5 meter (Gerbang 2)
4. Selesai konfigurasi dan mulai simulasi
""")
    
    pilihan = input("Masukkan pilihan Anda (1-4): ").lower()

    if pilihan in ['1', 'tambahkan plat', 'kurangi plat', 'registrasi']:
        # Sub-menu untuk tambah/kurang plat
        print("\n  Pilihan Plat:")
        print("  1. Tambah plat")
        print("  2. Hapus plat")
        sub_pilihan = input("  Masukkan pilihan (1-2): ").lower()

        if sub_pilihan in ['tambah plat', '1', 'tambah']:
            print("\n  (Ketik 'selesai' atau '-1' untuk berhenti menambahkan)")
            while True:
                plat_baru_input = input("  Tambah plat nomor (format: B 1234 XYZ atau AB 1234 XYZ)\n  : ")
                if plat_baru_input.lower() == 'selesai' or plat_baru_input == '-1':
                    break
                
                # Normalisasi input dengan 
                # membuat huruf-huruf menjadi huruf besar 
                plat_baru = plat_baru_input.strip().upper()

                if not plat_baru: # Lewati jika input kosong
                    continue

                if not validasi_format_plat(plat_baru):
                    print(f"  Format plat '{plat_baru_input}' tidak valid. Harus format: A 1234 XYZ atau AA 1234 XYZ (dipisah spasi).")
                    continue # Minta input lagi
                
                # Periksa duplikat
                # jika ada duplikat, tulis sudah terdaftar
                if plat_baru in PLAT_MOBIL_REGISTERED:
                    print(f"\n    Plat {plat_baru} sudah terdaftar.\n")
                else:
                    PLAT_MOBIL_REGISTERED.append(plat_baru)
                    print(f"\n    Plat {plat_baru} berhasil ditambahkan.\n")
        
        elif sub_pilihan in ['hapus plat', '2', 'hapus']:
            if not PLAT_MOBIL_REGISTERED:
                print("  Tidak ada plat terdaftar untuk dihapus.")
            else:
                print("  Daftar plat teregistrasi:")
                for i, plat in enumerate(PLAT_MOBIL_REGISTERED):
                    print(f"  {i + 1}. {plat}")
                
                while True:
                    try:
                        nomor_hapus = input("  Masukkan nomor urut plat yang akan dihapus (atau 'batal'): ").lower()
                        if nomor_hapus in ['batal', '-1', 'tidak', 'keluar']:
                            break # Keluar loop jika batal
                        
                        indeks_hapus = int(nomor_hapus) - 1
                        if 0 <= indeks_hapus < len(PLAT_MOBIL_REGISTERED):
                            plat_dihapus = PLAT_MOBIL_REGISTERED.pop(indeks_hapus)
                            print(f"  Plat {plat_dihapus} berhasil dihapus.")
                            break 
                        else:
                            print("  Nomor tidak valid. Coba lagi.")
                    except ValueError:
                        print("  Input tidak valid. Harap masukkan nomor urut. Coba lagi.")
                    except: # Ini kalau KeyboardError (^C) atau (^Z) 
                        pass
        else:
            print("  Pilihan tidak valid.")
        
        return False 

    elif pilihan in ['gerbang 1', '2']:
        # Ganti Harga Gerbang 1
        while True:
            try:
                harga_baru_1 = int(input(f"  Masukkan harga baru Gerbang 1 (saat ini Rp{HARGA_GERBANG_1},00): "))
                if harga_baru_1 >= 0:
                    HARGA_GERBANG_1 = harga_baru_1
                    print(f"  Harga Gerbang 1 berhasil diubah menjadi Rp{HARGA_GERBANG_1},00")
                    break # Keluar loop jika sukses
                else:
                    print("  Harga tidak boleh negatif. Coba lagi.")
            except ValueError:
                print("  Input tidak valid. Harap masukkan angka. Coba lagi.")
        return False # Belum selesai konfigurasi

    elif pilihan in ['gerbang 2', '3']:
        # Ganti Harga Gerbang 2
        while True:
            try:
                harga_baru_2 = int(input(f"  Masukkan harga baru Gerbang 2 (saat ini Rp{HARGA_GERBANG_2}): "))
                if harga_baru_2 >= 0:
                    HARGA_GERBANG_2 = harga_baru_2
                    print(f"  Harga Gerbang 2 berhasil diubah menjadi Rp{HARGA_GERBANG_2}")
                    break # Keluar loop jika sukses
                else:
                    print("  Harga tidak boleh negatif. Coba lagi.")
            except ValueError:
                print("  Input tidak valid. Harap masukkan angka. Coba lagi.")
            except: # Ini kalau KeyboardError (^C) atau (^Z) 
                pass
        return False # Belum selesai konfigurasi

    elif pilihan in ['4', 'selesai', 'keluar']:
        print("Konfigurasi tol selesai. Memulai simulasi ANPR....\n")
        return True 

    else:
        print("Pilihan tidak valid. Silakan coba lagi.")
        return False # Belum selesai konfigurasi

# Fungsi untuk memproses satu mobil 
def satu_mobil(ke: int = 1):
    
    while True:
        try:
            tinggi_mobil: int = int(input(f"\nMasukkan tinggi mobil ke-{ke} (dalam cm): "))
            break # Jika sukses (input adalah angka), keluar dari loop
        except ValueError:
            print("Harap masukkan angka. Silakan coba lagi.")
        except: # Ini kalau KeyboardError (^C) atau (^Z) 
            pass

    plat_mobil_input: str = input(f"Masukkan plat mobil ke-{ke}: ")
    # Normalisasi plat yang diinput saat simulasi agar cocok dengan data tersimpan
    plat_mobil: str = plat_mobil_input.strip().upper()

    saldo: int = -1
    if (plat_mobil in PLAT_MOBIL_REGISTERED):
        while True:
            try:
                saldo_input = input(f"Masukkan saldo mobil ke-{ke}: ")
                saldo = int(saldo_input)
                if saldo >= 0:
                    break #
                else:
                    print("Saldo tidak boleh negatif. Silakan coba lagi.")
            except ValueError:
                print("Harap masukkan angka yang benar. Silakan coba lagi.")
            except: # Ini kalau KeyboardError (^C) atau (^Z) 
                pass
    
    # Tentukan gerbang dan biaya yang harus dibayar
    harus_dibayar: int = 0
    if (425 >= tinggi_mobil and tinggi_mobil >= 250):
        gerbang_mobil: str = "Gerbang 2"
        harus_dibayar = HARGA_GERBANG_2
    elif (tinggi_mobil > 0 and tinggi_mobil < 250):
        gerbang_mobil: str = "Gerbang 1"
        harus_dibayar = HARGA_GERBANG_1
    else:
        # Mobil harus antara 0 atau 425 centimeter karena mobil yang lebih daripada itu tidak masuk akal
        print(f"Tinggi mobil ke-{ke} ({tinggi_mobil} cm) tidak valid (harus > 0 dan <= 425).")
        return # Lewati mobil ini

    # Proses pembayaran
    ditandain : bool = False
    if (saldo >= harus_dibayar):
        saldo -= harus_dibayar
        print(f"Sisa saldo mobil ke-{ke}: Rp{saldo},00. Silakan mobil ke-{ke} lewat {gerbang_mobil}.")
    elif (saldo >= 0 and saldo < harus_dibayar): # diubah dari > 0 menjadi >= 0
        # Saldo ada (bisa jadi 0) tapi tidak cukup
        ditandain = True
        print(f"Saldo mobil ke-{ke} (Rp{saldo},00) tidak cukup untuk membayar Rp{harus_dibayar},00. Silakan mobil ke-{ke} lewat {gerbang_mobil} dengan tanda merah di kendaraan.")
    else:
        # Saldo -1 (tidak terdaftar)
        print(f"Nomor plat mobil ke-{ke} ({plat_mobil_input}) tidak teregistrasi. Invoice sebesar Rp{harus_dibayar},00 akan dikirimkan. Silakan mobil ke-{ke} lewat {gerbang_mobil}.")


# Fungsi utama
def main():
    selesai_konfigurasi = False
    while not selesai_konfigurasi:
        selesai_konfigurasi = kondisi_tol() # Jika kondisi_tol() sudah selesai dengan return True, akan lanjut ke pengecekan/simulasi ANPR
    
    while True:
        try:
            banyak_mobil: int = int(input("Masukkan banyak mobil yang akan lewat: "))
            if banyak_mobil > 0:
                break # Jika sukses (angka valid dan > 0), keluar dari loop
            else:
                print("Jumlah mobil harus lebih dari 0. Silakan coba lagi.")
        except ValueError:
            print("Harap masukkan angka. Silakan coba lagi.")
        except: # Ini kalau KeyboardError (^C) atau (^Z) 
            pass

    for ke in range(banyak_mobil):
        satu_mobil(ke + 1)
    
    print("\nSimulasi selesai.")

# Jalankan program utama
# Ini bukan termasuk penggunaan fungsi, melainkan
# agar lebih idiomatik secara Python
if __name__ == "__main__":
    main()

