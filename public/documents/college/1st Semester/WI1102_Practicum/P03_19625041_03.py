#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 31 Oktober 2025 
# Deskripsi : BINGO yang dimodifikasi menggunakan konsep pointer

""" Komentar """
# Untung ga seribet ngecek persegi yang kemarin

""" Input """
n: int = int(input("Masukkan besar n: "))
deb: [int] = [0 for _ in range(n + 1)]
mik: [int] = [0 for _ in range(n + 1)]
vin: [int] = [0 for _ in range(n + 1)]

for i in range(1, n + 1):
    deb[i] = int(input(f"Masukkan angka ke-{n} Nona Deb: "))
for i in range(1, n + 1):
    mik[i] = int(input(f"Masukkan angka ke-{n} Tuan Mik: "))
for i in range(1, n + 1):
    vin[i] = int(input(f"Masukkan angka ke-{n} Tuan Vin: "))

""" Algoritma dan Output """
# Kita pakai pointer awal = 1 karena biar lebih gampang
deb_pointer: int = 1; deb_win: bool = False 
mik_pointer: int = 1; mik_win: bool = False 
vin_pointer: int = 1; vin_win: bool = False

GAME_SELESAI = False
while not GAME_SELESAI:
    # bener juga, ngapain pake pop orang tinggal pake pointer WKKWKWKWK
    panggilan: int = int(input("Masukkan angka yang dipanggil: "))

    # cari jarak terkecil
    angka_terkecil: int = 196250411962504119625041111222333444555666777888420694206942069420694206942069420694206942069420694206942069420694206913581
    if (abs(deb[deb_pointer] - panggilan) < angka_terkecil):
        angka_terkecil = abs(deb[deb_pointer] - panggilan)
    if (abs(mik[mik_pointer] - panggilan) < angka_terkecil):
        angka_terkecil = abs(mik[mik_pointer] - panggilan)
    if (abs(vin[vin_pointer] - panggilan) < angka_terkecil):
        angka_terkecil = abs(vin[vin_pointer] - panggilan)
    # cek balik
    if (abs(deb[deb_pointer] - panggilan) == angka_terkecil):
        deb_pointer += 1
    if (abs(mik[mik_pointer] - panggilan) == angka_terkecil):
        mik_pointer += 1 
    if (abs(vin[vin_pointer] - panggilan) == angka_terkecil):
        vin_pointer += 1

    # cek game end
    # kita pake if if if bukan if elif elif karena ya 
    # mereka semua bisa menang
    if (deb_pointer == n + 1):
        GAME_SELESAI = True
        deb_win = True
    if (mik_pointer == n + 1):
        GAME_SELESAI = True
        mik_win = True
    if (vin_pointer == n + 1):
        GAME_SELESAI = True
        vin_win = True

# output di sini 
# KENAPA NVIM KU SYNTAX HIGHLIHTER-NYA JELEK BANGETT UNTUK PYTHONNN
# Ternary operator is OP makanya sering dispam di Flutter, apalagi yang syntax 
# if () ... [] eh tapi itu bukan ternary sih
print(f"Pememang dari permainan ini adalah {'Nona Deb' if deb_win else ''}{', Tuan Mik' if (deb_win and mik_win) else ('Tuan Mik' if mik_win else '')}{', Tuan Vin' if ((deb_win or mik_win) and vin_win) else ('Tuan Vin' if vin_win else '')}")
