#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 17 Oktober 2025 
# Deskripsi : Mengecek kelayakan donor 

""" Komentar """
# Format alasan yang akan dioutput kurang jelas ketentuannya sehingga 
# saya akan menggunakan ketentuan sendiri yang 
# mencakup lebih banyak kasus
# Revisi: sudah ditambah sehingga nanti kucek lagi

""" Input """
# Kita akan melakukan input di sini
usia: int   = int(input("Masukkan usia: "));
berat: int  = int(input("Masukkan berat badan (kg): "));
# Akan diasumsikan bahwa False untuk setiap input yang tidak bernilai "Ya" sehingga 
# Inputan "Tidak" akan menjadi False juga
# Untuk variabel makan dan donor, saya akan menggunakan ternary operator karena sering sekali dipakai
# di C++ atau di NextJS (lihat faranaiki.id atau https://github.com/FaranAiki)
makan: bool = True if (input("Sudah makan dalam 4 jam terakhir ?: ") == "Ya") else False;
# Ekuivalen dengan
# if (input("...") == "Ya"):
#   makan = True 
# else:
#   makan = False
donor: bool = True if (input("Donor dalam 2 bulan terakhir ?: ") == "Ya") else False;
# Ekuivalen dengan
# if (input("...") == "Ya"):
#   donor = True 
# else:
#   donor = False

""" Algoritma """
# Kita akan menggunakan sintaks biasa untuk a <= x <= b maka ekuivalen dengan
# x >= dan x <= b
kondisi_usia:   bool = (usia >= 17 and usia <= 60);
kondisi_berat:  bool = (berat >= 45);
bisa_donor:     bool = kondisi_usia and kondisi_berat and makan and (not donor);
# Jika bisa donor dan berat badan di atas 70, gunakan ini
double_donor:   bool = bisa_donor and berat >= 70;

""" Output """
# Sebenarnya bisa tidak pakai else jika kita diperbolehkan
# menggunakan exit() atau def main() kemudian return
if double_donor:
    print("Layak donor darah. Jenis donor: Donor double (disarankan).");
elif bisa_donor:
    print("Layak donor darah. Jenis donor: Donor reguler.");
else:
    print("Tidak layak donor. Alasan:", end=" ");
    # TODO saya tidak tahu bagaimana format output yang benar jika ada
    # banyak alasan yang tidak memenuhi kondisi ini
    # Saya menggunakan if-if dan bukan if-elif karena bisa jadi ada beberapa kondisi yang membuat
    # kelayakan donor tidak terpenuhi
    if (not kondisi_usia):
        print("Belum cukup umur", end=". ");
    if (not kondisi_berat):
        print("Berat tidak sesuai dengan kriteria", end=". ");
    # Hanya ini yang ada pada output test case 
    if (not makan):
        print("Belum makan", end=". ");
    if (donor):
        print("Sudah donor", end=". ");
    # Tambahin newline
    print();



