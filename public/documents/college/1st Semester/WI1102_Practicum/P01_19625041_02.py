#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 3 Oktober 2025 
# Deskripsi : Menghitung uang yang dibutuhkan untuk menutupi kekurangan uang Deb

""" Deklarasi Konstanta """
# const
PERSEN_DISKON : int = 5
PERSEN_PAJAK  : int = 10

""" Input """
# Input variabel dengan semuanya integer/bilangan bulat
uang:   int = int(input("Uang Nona Deb sekarang: "))
harga:  int = int(input("Harga tiket: "))
tiket:  int = int(input("Jumlah tiket yang dibeli: "))

""" Process """
# Melakukan algoritma sesuai dengan instruksi pada soal
harga_diskon:           float = harga * (100 - PERSEN_DISKON) / 100 
harga_sebelum_pajak:    float = harga_diskon * tiket 
harga_total:            float = harga_sebelum_pajak + (PERSEN_PAJAK / 100) * harga_sebelum_pajak # bisa juga (1 + PERSEN_PAJAK/100) * ...
uang_yang_dibutuhkan:   float = abs(harga_total - uang) # abs tidak dibutuhkan, tetapi untuk membuat dia tidak menjadi negatif entah untuk apa 

""" Output """
# Output dengan satu variabel 
# Kelas (bukan fungsi) int dipakai untuk mengubah dari float menjadi bilangan bulat 
print(f"Nona Deb perlu mengumpulkan uang sebesar {int(uang_yang_dibutuhkan)}")
