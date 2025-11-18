#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 14 November 2025 
# Deskripsi : Bahasa Vin

""" Komentar """
# untung inget kapital beda sama kecil

""" Fungsi """
def palindrom(s: str) -> bool:
    # i didn't get paid enough to optimize this to O(N/2) ~ O(N)
    for i in range(len(s)):
        if s[i] != s[len(s) - i - 1]: return False

    return True 

def vokal(s: str) -> bool:
    # yaudah gitu doang
    for ch in s:
        if ch in 'aiueoAIUEO': return True 
    return False

def konsonan(s: str) -> bool:
    # yaudah gitu doang
    for ch in s:
        if ch in 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ': return True
    return False

def sebelahan(s: str) -> bool:
    for i in range(len(s) - 1):
        if s[i] == s[i + 1]:
            return False
    return True

def bahasa_vin(s: str) -> bool:
    return palindrom(s) and vokal(s) and konsonan(s) and sebelahan(s)

""" Input dan Output """
print("Kata tersebut termasuk dalam Bahasa Vin" if bahasa_vin(input("Masukkan kata: ")) else "Kata tersebut tidak termasuk dalam Bahasa Vin")

