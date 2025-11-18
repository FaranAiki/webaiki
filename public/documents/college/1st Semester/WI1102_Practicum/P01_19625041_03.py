#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 3 Oktober 2025 
# Deskripsi : Menghitung clock dan efisiensi dari sebuah algoritma 

""" Deklarasi Konstanta """
# const
SATU_MIKRODETIK     : int = 0.000001
SATU_GHZ            : int = 1_000 #* SATU_MHZ 

""" Input """
# Input variabel dengan semuanya berbentuk integer
operasi:    int = int(input("Masukkan jumlah operasi: "))
waktu:      int = int(input("Masukkan waktu per operasi (mikrodetik): "))
overhead:   int = int(input("Masukkan overhead (persen): "))
frekuensi:  int = int(input("Masukkan frekuensi (GHz): "))

""" Process """
# Ini sesuai dengan instruksi yang diberikan pada modul 01 
waktu_total     : float = (waktu * operasi) * (1 + overhead / 100)
clock           : float = waktu_total * frekuensi * SATU_GHZ
efisiensi       : float = operasi / waktu_total / SATU_MIKRODETIK


""" Output """
# Output dengan dua variabel
# Kemudian, kita menggunakan f-string agar bisa dua desimal di belakang
print(f"Clock cycle yang dihasilkan adalah {clock:.2f} cycle dengan efisiensi {efisiensi:.2f} operasi/detik.")

