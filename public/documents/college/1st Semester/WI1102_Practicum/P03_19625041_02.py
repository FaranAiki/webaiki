#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 31 Oktober 2025 
# Deskripsi : Lampu saklar dan kelipatannya 

""" Komentar """
# Jadi aku mau curhat kan sebelum praktikum aku bilang ke Chief Technology Officer perusahaan aku magang 
# (Mas, done ini [widget yang aku buat di flutter])
# Terus aku disuruh meeting, padahal kan pengen praktikum yak
# jadi ntar jam 8

""" Input dan Algoritma """
jumlah_lampu: int = int(input("Jumlah lampu dan saklar: "))
# kita pake + 1 agar indexing dari 1
kondisi_lampu: bool = [False for _ in range(jumlah_lampu + 1)] # pake modul, sebenarnya pake += "sah" ga si kan bukan fungsi 
BELUM_BERAK = True # masa ga boleh pake berak jadi harus inisialisasi sendiri
while BELUM_BERAK: 
    inputan_mik: int = int(input("Masukkan nomor saklar yang ditekan: "))
    if inputan_mik == -1: BELUM_BERAK = False
    else:
        # do this magic
        # ya ga magic juga orang ini pengenalan untuk sieve of eratosthenes
        kelipatan = 1 
        while (kelipatan * inputan_mik) <= jumlah_lampu:
            kondisi_lampu[kelipatan * inputan_mik] = not kondisi_lampu[kelipatan * inputan_mik]
            kelipatan += 1

""" Output """
print("Status lampu:")
for lampu_ke in range(1, jumlah_lampu + 1):
    print(f"Lampu {lampu_ke}: {'Menyala' if kondisi_lampu[lampu_ke] else 'Mati'}")


