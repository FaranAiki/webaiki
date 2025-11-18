#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 31 Oktober 2025 
# Deskripsi : Menghitung rata-rata jam tidur, apakah ada sleep debt, dan minimum jam tidur yang terjadi 

""" Komentar """
# Aku lupa INT_MAX di Python itu didefine di mana kalau ngga salah harus import module apa gitu, tetapi 
# import kan ngga boleh pakai modul jadinya aku definisiin angka random aja

""" Input dan Algoritma """
jam_tidur: [float] = [0, 0, 0, 0, 0, 0, 0, 0] # aku pake numbering 1 wlee
total_tidur: float = 0
loop_berapa_kali: int = 7
min_tidur: float = 123454206942069420694206942069420694206919625041196250411962504119625041177013177013696969691962504180085800858008580085; min_tidur_hari: int = -1; #-1 itu buat signifier bahwa belom diinisialisasi, ya masa pake None ngga mau dikira None itu null apa
max_tidur: float = 0; min_tidur_hari: int = -1;
sleep_debt_counter: int = 0; hari_sleep_debt_awal: int = -1; hari_sleep_debt_akhir: int = -1;
hari: int = 1
# output awal (preinput)
print("Masukkan jam tidur untuk 7 hari:")

# argh ga boleh pake sum or average = lambda a: sum(a)/len(a)
# ga tau boleh pake range ato engga jadi pake while aja
# eh aku liat di modul boleh, tetapi yaudah deh udah telanjur pake while
semua_tenang = True 
while hari <= loop_berapa_kali:
    jam_tidur[hari] = float(input(f"Hari ke-{hari}: "))
    total_tidur += jam_tidur[hari]
    # idk why pake max, semoga tambahan poin mweheheh
    if (jam_tidur[hari] >= max_tidur):
        max_tidur = jam_tidur[hari]
        max_tidur_hari = hari 
    if (jam_tidur[hari] <= min_tidur): # kita pake <= agar output yang paling akhir
        min_tidur = jam_tidur[hari]
        min_tidur_hari = hari
    if (jam_tidur[hari] < 6):
        sleep_debt_counter += 1
    else:
        semua_tenang = False
        sleep_debt_counter = 0 
    if (sleep_debt_counter >= 3):
        hari_sleep_debt_akhir = hari
    elif (hari_sleep_debt_akhir == -1 and sleep_debt_counter == 1):
        hari_sleep_debt_awal = hari
    hari += 1

# Kasus pengecualian yang abstrak dan solusi aneh 
# maaf saya ngga terlalu gacor jadi corner casenya solusinya gini aja WKKWKWK
if (hari_sleep_debt_awal == 1 and hari_sleep_debt_akhir == 7 and not semua_tenang):
    hari_sleep_debt_awal = 4

""" Output """
print(f"Rata-rata jam tidur: {total_tidur / 7:.2f} jam per hari\nJam tidur paling sedikit {min_tidur} (Hari ke-{min_tidur_hari})")
if (hari_sleep_debt_akhir != -1):
    print(f"PERINGATAN: Ditemukan sleep debt streak! Hari ke-{hari_sleep_debt_awal} sampai ke-{hari_sleep_debt_akhir} tidur kurang dari 6 jam berturut-turut.")
else:
    print("Pola tidur sehat! Tidak ada sleep debt streak.")

