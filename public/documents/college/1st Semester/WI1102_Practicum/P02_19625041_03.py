#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 17 Oktober 2025 
# Deskripsi : Menentukan pemenang dari peperangan Kerajaan Wei vs Kerajaan Wu

""" Komentar """
# Untuk tes kasus kedua, ada kesalahan karena lupa 
# meninjau bahwa PP Wu < PP Wei sehingga 
# jawaban yang tepat adalah 2900 PP, bukan 4400 PP.

""" Konstanta """
# Konstanta ini didefinisikan pada soal
PERBEDAAN_MORAL: float = 0.05

""" Input """
# Kita akan secara verbatim menulis prompt inputan karena 
# bukan salah saya jika ada typo dalam soal hehe
moral_pasukan:  float = float(input("Masukkan moral pasukan: ")); # dengan 0 < moral_pasukan < 1 
prajurit_wei:   int = int(input("Mauskkan banyak prajurit Kerajaan Wei: "));
jarak_wei:      int = int(input("Masukkan jarak tempuh Kerajaan Wei: "));
prajurit_wu:    int = int(input("Masukkan banyak prajurit Kerajaan Wu: "));
jarak_wu:       int = int(input("Masukkan jarak tempuh Kerjaaan Wu: "));

""" Algoritma """
# Pakai formula yang pada soal dan tambahkan ternary conditional
# dengan kita akan menambahkan 800 jika jarak_wei < jarak_wu, sementara tambahkan 0 karena 
# a + 0 = a

# Ini saya bingung apakah tipe data untuk PP itu bilangan bulat atau
# bilangan melayang (wkkw, single), tetapi saya asumsikan float, kemudian
# akan dikonversi menjadi integer untuk formatting string
PP_wei:    float = prajurit_wei * (moral_pasukan + PERBEDAAN_MORAL) / jarak_wei + (800 if (jarak_wei < jarak_wu) else 0) ; 
PP_wu:     float = prajurit_wu * (moral_pasukan) / jarak_wu; 

PP_wu += 1500 if (PP_wu < PP_wei) else 0;

""" Output """
# Bandingkan mana yang menang dan mana yang kalah
if (PP_wu > PP_wei):
    print("Kerajaan Wu menang dari Kerajaan Wei dengan selisih sebesar", int(PP_wu - PP_wei), "PP");
else:
    print("Kerajaan Wei menang dari Kerajaan Wu dengan selisih sebesar", -int(PP_wu - PP_wei), "PP");

