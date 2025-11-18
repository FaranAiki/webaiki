#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 14 November 2025 
# Deskripsi : Sistem koin emas yang berupa perunggu, perak, dan emas 

""" Komentar """
# Paling lama di sini justru adalah FORMATTINGNYA karena ak maksa pake if else if else wkkwkwk

""" Fungsi dan Algoritma """
# kok ga boleh pake lambda sih kakk
def ii(s: str) -> int:
    return int(input(s))

# seharusnya valid-valid aja kan kek gini kak
# soalnya kalo array boleh jadi parameter,
# jadi return juga boleh
def olah(perunggu: int) -> ["perunggu", "perak", "emas"]:
    # kita pake mod di sini
    # ini soal gampang sih 
    olahan = [0, 0, 0]
    olahan[0] = perunggu % 10  
    olahan[1] = (perunggu // 10) % 10 
    olahan[2] = (perunggu // 100)
    olahan[2] += olahan[2] // 5
    return olahan 

# formatting
def formatting(hasil: ["perunggu", "perak", "emas"]) -> str:
    if (hasil[2] == hasil[1] and hasil[1] == 0):
        return "Koin Nona Sal tidak cukup untuk ditukarkan."

    # ini time consuming banget wakk
    # return f'Nona Sal akan mendapatkan {"" if not hasil[2] else (f"{hasil[2]} emas" if hasil[1] else f"{hasil[2]} emas")}{"," if hasil[0] and hasil[1] else (" dan" if hasil[2] and hasil[1] and not hasil[0] else ",")}{"" if not hasil[1] else f" {hasil [1]} perak"}{"," if hasil[2] and hasil[1] else ""}{"" if not hasil[0] else (f" dan {hasil[0]} perunggu" if hasil[1] or hasil[2] else f"{hasil[0]} perunggu")} dari hasil penukaran.'
    return f'Nona Sal akan mendapatkan{f" {hasil[2]} emas" if hasil[2] else ""}{"," if hasil[2] and hasil[1] and hasil[0] else (" dan" if hasil[1] and hasil[2] else "")}{f" {hasil[1]} perak" if hasil[1] else ""}{", dan" if hasil[1] and hasil[0] and hasil[2] else (" dan" if hasil[0] and hasil[1] else "")}{f" {hasil[0]} perunggu" if hasil[0] else ""} dari hasil penukaran.'

""" Input dan Output """ 
print(formatting(olah(ii("Masukkan jumlah koin perunggu: "))))

