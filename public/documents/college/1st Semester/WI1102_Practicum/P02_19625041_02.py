#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 17 Oktober 2025 
# Deskripsi : Mengecek apakah empat titik tersebut dapat membuat sebuah persegi 

""" Komentar """
# Akan ada delapan input untuk mengisi titik-titik karena
# materi string.split ataupun regex belum dipelajari
# sehingga akan dibuat inputan yang lebih mudah
# Saya juga masih agak kurang tahu apakah Test Case 3 itu valid karena saya belum 
# terlalu mempelajari algoritma untuk menentukan apakah sebuah titik itu persegi

""" Input """
# Kita akan memparse sebuah string dalam bentuk \(\d+?, \d+?\)
# Menggunakan ??? memang bisa tanpa pakai split atau regex kah? 
# Oke karena ada revisi, inputannya saya modifikasi sendiri agar mempermudah pengerjaan soal
# sehingga saya akan menggunakan delapan input

# Titik 1
P_1_x: int = int(input("Masukkan koordinat x (absis) titik ke-1: "));
P_1_y: int = int(input("Masukkan koordinat y (ordinat) titik ke-1: "));

# Titik 2
P_2_x: int = int(input("Masukkan koordinat x (absis) titik ke-2: "));
P_2_y: int = int(input("Masukkan koordinat y (ordinat) titik ke-2: "));

# Titik 3
P_3_x: int = int(input("Masukkan koordinat x (absis) titik ke-3: "));
P_3_y: int = int(input("Masukkan koordinat y (ordinat) titik ke-3: "));

# Titik 4
P_4_x: int = int(input("Masukkan koordinat x (absis) titik ke-4: "));
P_4_y: int = int(input("Masukkan koordinat y (ordinat) titik ke-4: "));

""" Algoritma """
# Oke, hint-nya sangat membantu (tidak terlalu sih)
# Ambil sebarang titik, misalkan titik 1 dan titik_2 kemudian kita bagi kasus 

persegi: bool = False;

# Maaf kalau panjang karena saya tidak tahu algoritma yang lebih tepat
# Sehingga ini terlihat sangat aneh, ya tetapi terkadang game dev begitu
if (P_1_y == P_2_y) and (P_1_x == P_3_x or P_1_x == P_4_x) and (P_2_x == P_3_x or P_2_x == P_4_x) and (P_3_y == P_4_y):
    # Jadi seperti sliding gitu kalau Y fiks
    persegi = True;
elif (P_1_x == P_2_x) and (P_1_y == P_3_y or P_1_y == P_4_y) and (P_2_y == P_3_y or P_2_y == P_4_y) and (P_3_x == P_3_x):
    # Jadi seperti sliding gitu kalau X fiks
    persegi = True;
# Nah, ini kasus anomali karena kita harus meninjau tiga kasus lagi
# dan harus menggunakan teknik refleksi terhadap titik apalah itu
"""
else:
    if ((P_1_x == P_3_x and P_2_y == P_3_y) or (P_1_x == P_4_x and P_2_y == P_4_y)):
        persegi = True;
    # kasus refleksi
    elif (((2 * P_2_x - P_1_x == P_3_x) and (P_1_y == P_3_y)) or ((2*P_2_x - P_1_x == P_4_x) and P_1_y == P_4_y)) and \
    (((2 * P_1_y - P_2_y == P_3_y) and (P_2_x == P_3_x)) or ((2*P_1_y - P_2_y == P_4_y) and P_2_x == P_4_x)):
        persegi = True;
""" # saya tidak yakin ini memberikan persegi yang valid

""" Output """
if (persegi):
    print("Keempat titik tersebut membentuk Persegi");
else:
    print("Keempat titik tersebut tidak membentuk Persegi");


