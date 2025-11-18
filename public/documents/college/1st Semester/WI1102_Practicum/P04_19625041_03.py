#!/bin/python

""" Identitas """
# NIM/Nama  : 19625041 / Muhammad Faran Aiki
# Tanggal   : 14 November 2025 
# Deskripsi : Membantu Tuan Vin "jenius" dalam menghitung penanggalan teleportasi 

""" Komentar """
# Tuan Vin jenius tapi buat program sederhana aja kaga bisa wkkwkw, skill issue
# ya kenapa Vin kaga pake cetgpt aja masa teleportasi bisa tapi 
# prompt ke gpt ada apa karena pas tahun itu AI masih kaga ada
# tapi kok bisa ada teleportasi kaowkawoak janggal

""" Konstanta """
nama_bulan = [
    "Aku anak keren", 
    "Solan",
    "Lunara", # wee nama panggilan pacar saya
    "Terran",
    "Pyron",
    "Aquen",
    "Zephyr", # wee nama laptop pacar saya
    "Umbra",
    "Lumen",
    "Astra",
    "Dimensi"
]

jumlah_hari = [
    19625041,
    37, # Solan 
    38, # Lunara 
    39, # Terran 
    40, # Pyron 
    39, # Aquen 
    36, # Zephyr 
    41, # Umbra 
    36, # Lumen 
    37, # Astra 
    -1  # Dimensi ## dengan -1 akan diganti oleh tahun = ... (mod 5)
]

HARI    : int = 177013
BULAN   : int = 42069
TAHUN   : int = 800815
n_skrg  : int = 0
yg_dipk : str = "hehe"

""" Fungsi """
def format_tanggal(s: str) -> ["hari", "bulan", "tahun"]:
    # ga ada salahnya pake global kan mweheeh
    global HARI, BULAN, TAHUN
    ssaa = s.split(" ")
    HARI = int(ssaa[0])
    BULAN = int(ssaa[1])
    TAHUN = int(ssaa[2])

# ini pake while loop aja... nyerah
# kalo dihitung secara matematis

# ini fungsi constant 
def hitung_dimensi() -> int:
    return TAHUN % 5

def hari_bulan(bulan) -> int:
    if jumlah_hari[bulan] == -1:
        return hitung_dimensi()
    return jumlah_hari[bulan]

def setelah(n) -> ["hari", "bulan", "tahun"]:
    global n_skrg, yg_dipk
    yg_dipk = "setelahnya"
    n_skrg = n

    hari = HARI
    bulan = BULAN
    tahun = TAHUN

    while (n != 0):
        if bulan >= 10:
            bulan = 1
            tahun += 1
        if (n >= hari_bulan(bulan)):
            n -= hari_bulan(bulan)
            bulan += 1
        else:
            hari += n 
            n = 0

    return [hari, bulan, tahun]

def sebelum(n) -> ["hari", "bulan", "tahun"]:
    global n_skrg, yg_dipk
    yg_dipk = "sebelumnya"
    n_skrg = n

    hari = HARI
    bulan = BULAN
    tahun = TAHUN

    while (n != 0):
        if (n >= hari_bulan(bulan)):
            n -= hari_bulan(bulan)
            bulan -= 1
        else:
            bulan -= 1
            if bulan == 0:
                bulan = 10
                tahun -= 1
            hari = hari_bulan(bulan) - n 
            n = 0
        if bulan <= 0:
            bulan = 10
            tahun -= 1


    return [hari, bulan, tahun]

def format_output(aa) -> str:
    return f"{n_skrg} hari {yg_dipk} adalah {aa[0]} {nama_bulan[aa[1]]} {aa[2]}"

""" Input """
format_tanggal(input("Masukkan tanggal: "))
# wayoloo apa inii
print(format_output((setelah if input("Masukkan fungsi: ").lower() == "setelah" else sebelum)(int(input("Masukkan n: ")))))

# inilah kenapa Haskell sebagai functional programming terbaik
# tanpa side effect dan pakai monad itu terbaik
