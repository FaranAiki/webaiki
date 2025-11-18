#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 3 Oktober 2025 
# Deskripsi : Menghitung ukuran fail setelah dikompres 

""" Deklarasi Konstanta """
# const 
SATU_BYTE  = 8 # bit
SATU_MB    = 1_000_000

""" Input """
# Input untuk variabel yang digunakan
"""
lebar, tinggi, warna, dan rasio
kita definisikan sebagai bilangan bulat (integer, int)
"""

lebar:  int = int(input("Masukkan lebar gambar (pixel): "))
tinggi: int = int(input("Masukkan tinggi gambar (pixel): "))
warna:  int = int(input("Masukkan kedalaman warna (bit): "))
rasio:  int = int(input("Masukkan rasio kompresi (persen): "))

""" Process and Output """
# Pakai lebar x tinggi x warna x rasio / 8 / 100 / 1_000_000
# Kemudian, kita menggunakan f-string agar bisa dua desimal di belakang
print(f"Ukuran file gambar setelah kompresi adalah {lebar * tinggi * warna * rasio / SATU_BYTE / 100 / SATU_MB:.2f} MB")
