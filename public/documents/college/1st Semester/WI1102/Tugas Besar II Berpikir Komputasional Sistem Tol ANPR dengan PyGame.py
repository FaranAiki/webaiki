import pygame
import sys
import random
import textwrap

# ==============================
# INIT
# ==============================
pygame.init()
WIDTH, HEIGHT = 900, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Game Pintu Tol Otomatis - Dark Mode")
clock = pygame.time.Clock()

# ==============================
# COLOR (DARK THEME PALETTE)
# ==============================
# Backgrounds
BG_DARK = (18, 18, 24)        # Hampir hitam
BG_PANEL = (30, 30, 40)       # Abu-abu gelap untuk kartu/panel
BG_INPUT = (45, 45, 55)       # Input box background

# Accents
WHITE = (240, 240, 240)       # Teks utama
GRAY_TEXT = (170, 170, 170)   # Teks sekunder
CYAN = (0, 220, 220)          # Aksen utama (Tombol/Garis)
NEON_GREEN = (50, 255, 100)   # Sukses / Lolos
NEON_RED = (255, 60, 80)      # Gagal / Saldo Kurang
YELLOW = (255, 200, 0)        # Bonus / Poin

# Road
ROAD_COLOR = (40, 40, 45)     # Warna aspal
LINE_COLOR = (100, 100, 100)  # Marka jalan

# ==============================
# FONT
# ==============================
# Menggunakan "Verdana" atau "Arial" untuk keterbacaan yang lebih baik (Sans-Serif)
# Title Font
TITLE_FONT = pygame.font.SysFont("Verdana", 36, bold=True)
if not TITLE_FONT: # Fallback jika Verdana tidak ada
    TITLE_FONT = pygame.font.SysFont("Arial", 42, bold=True)

# Subtitle Font
SUBTITLE_FONT = pygame.font.SysFont("Verdana", 22)

# Text Font - Diperkecil agar muat di layout (18 -> 15)
TEXT_FONT = pygame.font.SysFont("Verdana", 15)       
BUTTON_FONT = pygame.font.SysFont("Verdana", 20, bold=True)

# ==============================
# INFO
# ==============================
info_text = """
Tujuan: Kumpulkan 100 poin 
untuk menang.
\n \n \n \n \n \n \n \n
Setiap kendaraan yang lolos 
memberikan 10 poin.
\n \n \n \n \n \n \n \n
Penalti 5 poin diberikan
jika tidak ada kendaraan
yang lolos.
"""
show_info = False
info_button_center = (850, 77)
info_button_radius = 20

# ==============================
# STATE
# ==============================
SCREEN_MENU = "menu"
SCREEN_GAME = "game"
SCREEN_RESULT = "result"
SCREEN_WIN = "win"
current_screen = SCREEN_MENU

# ==============================
# GAME DATA
# ==============================
MAX_REGISTER = 5  
JUMLAH_MOBIL = 10
MIN_SALDO = 25000

registered_numbers = []
mobil_list = []

poin_total = 20
poin_sesi = 0
penalti = 0

TOL_WIDTH = WIDTH // 2
BATAS_TOL = TOL_WIDTH - 80
LEBAR_KOTAK = 70

# ==============================
# UI MENU LAYOUT
# ==============================
input_box = pygame.Rect(50, 220, 280, 45)
add_button = pygame.Rect(340, 220, 50, 45)
start_button = pygame.Rect(50, 530, 340, 45)
lanjut_button = pygame.Rect(WIDTH//2 - 100, 400, 200, 50)

# LIST SETTINGS
LIST_START_Y = 300
ROW_HEIGHT = 45 

# ==============================
# LANE POSITIONS
# ==============================
LANES_Y = [280, 330, 380, 430]

# ==============================
# FUNCTION
# ==============================

def generate_mobil():
    data = []
    available_colors = [(200, 50, 50), (50, 100, 200), (200, 200, 50), (200, 200, 200)]
    for _ in range(JUMLAH_MOBIL):
        data.append({
            "nomor": f"B {random.randint(1000,9999)} {random.choice(['XY', 'BD', 'JK'])}",
            "saldo": random.randint(5_000, 60_000),
            "required_points": random.choice([5, 10, 15]),
            "status": "",
            "x": -100,
            "y": random.choice(LANES_Y),
            "speed": random.randint(4, 7),
            "active": False,
            "bonus_timer": 0,
            "color": random.choice(available_colors)
        })
    return data

mobil_list = generate_mobil()
current_index = 0

user_text = ""
input_active = False

def draw_rounded_rect(surface, color, rect, radius=10):
    pygame.draw.rect(surface, color, rect, border_radius=radius)

def draw_car_visual(surface, car_dict):
    x, y = car_dict["x"], car_dict["y"]
    color = car_dict["color"]
    
    # Bayangan mobil
    pygame.draw.rect(surface, (20, 20, 20), (x+5, y+5, 80, 34), border_radius=8)
    # Body Mobil
    pygame.draw.rect(surface, color, (x, y, 80, 34), border_radius=8)
    # Kaca Jendela
    pygame.draw.rect(surface, (30, 30, 40), (x+20, y+4, 25, 26))
    # Lampu Depan
    pygame.draw.circle(surface, (255, 255, 200), (x+78, y+8), 3)
    pygame.draw.circle(surface, (255, 255, 200), (x+78, y+26), 3)
    # Plat Nomor (Kecil)
    pygame.draw.rect(surface, WHITE, (x+2, y+10, 10, 14))

# ==============================
# MAIN LOOP
# ==============================
running = True
while running:
    clock.tick(60)
    screen.fill(BG_DARK)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        # ================= MENU EVENT =================
        if current_screen == SCREEN_MENU:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if input_box.collidepoint(event.pos):
                    input_active = True
                else:
                    input_active = False

                # LOGIC TOMBOL HELP (?)
                dx = event.pos[0] - info_button_center[0]
                dy = event.pos[1] - info_button_center[1]
                if dx*dx + dy*dy <= info_button_radius*info_button_radius:
                    show_info = not show_info

                # LOGIC TOMBOL TAMBAH (+)
                if add_button.collidepoint(event.pos):
                    if user_text.strip() and len(registered_numbers) < MAX_REGISTER and user_text.strip() not in registered_numbers:
                        nomor = user_text.strip().upper()
                        # Find the car with this nomor
                        car = next((m for m in mobil_list if m["nomor"] == nomor), None)
                        if car:
                            if poin_total >= car["required_points"]:
                                registered_numbers.append(nomor)
                                poin_total -= car["required_points"]
                                user_text = ""
                            else:
                                pass # Saldo poin kurang
                        else:
                            registered_numbers.append(nomor)
                            poin_total -= 0
                            user_text = ""
                
                # LOGIC TOMBOL HAPUS (X)
                # Loop untuk mendeteksi klik tombol hapus berdasarkan posisi dinamis
                for i in range(len(registered_numbers)):
                    # Hitung posisi Y yang sama dengan saat menggambar (Render)
                    current_item_y = LIST_START_Y + (i * ROW_HEIGHT)
                    
                    # Buat area deteksi tombol
                    del_btn_rect = pygame.Rect(350, current_item_y + 2, 30, 30)
                    
                    if del_btn_rect.collidepoint(event.pos):
                        nomor_dihapus = registered_numbers[i]
                        car = next((m for m in mobil_list if m["nomor"] == nomor_dihapus), None)
                        if car:
                            poin_total += car["required_points"]
                        registered_numbers.pop(i)
                        break

                if start_button.collidepoint(event.pos):
                    poin_sesi = 0
                    current_index = 0
                    for m in mobil_list:
                        m["x"] = -100
                        m["active"] = False
                        m["status"] = ""
                    current_screen = SCREEN_GAME

            # FORMATTING INPUT OTOMATIS
            if event.type == pygame.KEYDOWN and input_active:
                if event.key == pygame.K_BACKSPACE:
                    user_text = user_text[:-1]
                elif len(user_text) < 14 and (event.unicode.isalnum() or event.unicode == " "):
                    char_masuk = event.unicode.upper()
                    if len(user_text) > 0 and char_masuk != " ":
                        last_char = user_text[-1]
                        if last_char.isalpha() and char_masuk.isdigit():
                            user_text += " "
                        elif last_char.isdigit() and char_masuk.isalpha():
                            user_text += " "
                    user_text += char_masuk

        # ================= RESULT EVENT =================
        if current_screen == SCREEN_RESULT:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if lanjut_button.collidepoint(event.pos):
                    penalti = 0
                    mobil_list = generate_mobil()
                    registered_numbers.clear()
                    current_screen = SCREEN_MENU

        # ================= WIN EVENT =================
        if current_screen == SCREEN_WIN:
            if event.type == pygame.MOUSEBUTTONDOWN:
                if lanjut_button.collidepoint(event.pos):
                    penalti = 0
                    mobil_list = generate_mobil()
                    registered_numbers.clear()
                    current_screen = SCREEN_MENU

    # Update bonus timers
    for m in mobil_list:
        if m["bonus_timer"] > 0:
            m["bonus_timer"] -= 1

    # ================= RENDER MENU =================
    if current_screen == SCREEN_MENU:
        screen.blit(TITLE_FONT.render("SISTEM TOL OTOMATIS", True, CYAN), (50, 50))
        screen.blit(SUBTITLE_FONT.render("MANAJEMEN DATABASE KENDARAAN", True, GRAY_TEXT), (50, 100))

        # Tombol Info (?)
        pygame.draw.circle(screen, CYAN, info_button_center, info_button_radius)
        info_text_render = TEXT_FONT.render("?", True, BG_DARK)
        info_text_rect = info_text_render.get_rect(center=info_button_center)
        screen.blit(info_text_render, info_text_rect)

        # Panel Kiri (Form)
        left_panel_rect = pygame.Rect(30, 160, 380, 430)
        draw_rounded_rect(screen, BG_PANEL, left_panel_rect)
        pygame.draw.rect(screen, CYAN, left_panel_rect, 2, border_radius=10)

        screen.blit(SUBTITLE_FONT.render("Registrasi Plat Nomor", True, WHITE), (50, 185))
        
        # Input Box
        color_input = CYAN if input_active else BG_INPUT
        draw_rounded_rect(screen, BG_INPUT, input_box, 5)
        pygame.draw.rect(screen, color_input, input_box, 2, border_radius=5)
        
        text_surf = TEXT_FONT.render(user_text, True, WHITE)
        screen.blit(text_surf, (input_box.x + 10, input_box.y + 12))

        # Add Button
        draw_rounded_rect(screen, CYAN, add_button, 5)
        screen.blit(BUTTON_FONT.render("+", True, BG_DARK), (add_button.x + 16, add_button.y + 8))

        # List Registered
        screen.blit(SUBTITLE_FONT.render("Terdaftar:", True, GRAY_TEXT), (50, 260))
        
        for i, n in enumerate(registered_numbers):
            # Menggunakan ROW_HEIGHT agar spasi vertikal lebih lega
            item_y = LIST_START_Y + (i * ROW_HEIGHT)
            
            # Background item
            draw_rounded_rect(screen, BG_INPUT, (50, item_y, 290, 36), 5)
            
            # Teks Item
            screen.blit(TEXT_FONT.render(f"{i+1}. {n}", True, NEON_GREEN), (60, item_y + 8))
            
            # Tombol Hapus (X)
            del_rect = pygame.Rect(350, item_y + 2, 30, 32)
            draw_rounded_rect(screen, NEON_RED, del_rect, 5)
            del_text = TEXT_FONT.render("X", True, WHITE)
            screen.blit(del_text, (del_rect.x + 9, del_rect.y + 5))

        # Start Button
        draw_rounded_rect(screen, CYAN, start_button, 10)
        start_text = BUTTON_FONT.render("MULAI SIMULASI", True, BG_DARK)
        screen.blit(start_text, start_text.get_rect(center=start_button.center))

        # Panel Kanan (Info)
        right_panel_rect = pygame.Rect(430, 160, 440, 420)
        draw_rounded_rect(screen, BG_PANEL, right_panel_rect)
        
        screen.blit(SUBTITLE_FONT.render("Antrian Kendaraan & Saldo", True, WHITE), (450, 190))
        screen.blit(TEXT_FONT.render(f"Biaya Tol: Rp {MIN_SALDO:,}", True, NEON_RED), (450, 220))

        y = 245 # Naikkan posisi awal agar tidak ada spasi kosong di atas
        for i, m in enumerate(mobil_list):
            color_row = WHITE if i % 2 == 0 else GRAY_TEXT
            detail_text = f"{m['nomor']} | Rp {m['saldo']:,} | Req: {m['required_points']} pt"
            screen.blit(TEXT_FONT.render(detail_text, True, color_row), (450, y))
            y += 25 # Rapatkan sedikit agar muat di bawah (sebelumnya 28)

        # Footer Info Poin
        poin_rect = pygame.Rect(450, 520, 400, 40)
        draw_rounded_rect(screen, BG_INPUT, poin_rect, 5)
        screen.blit(TEXT_FONT.render(f"Poin Anda: {poin_total}", True, YELLOW), (470, 530))

        # Box Info
        if show_info:
            pygame.draw.rect(screen, BG_PANEL, (280, 200, 265, 220))
            pygame.draw.rect(screen, WHITE, (280, 200, 265, 220), 2)

            wrapped_text = textwrap.fill(info_text.strip(), width=30)
            lines = wrapped_text.split('\n')
            y_offset = 210
            for line in lines:
                screen.blit(TEXT_FONT.render(line, True, WHITE), (300, y_offset))
                y_offset += 30

    # ================= GAME =================
    elif current_screen == SCREEN_GAME:
        screen.blit(TITLE_FONT.render("SIMULASI BERJALAN", True, WHITE), (WIDTH//2 - 200, 30))

        # AREA TOL
        game_area_rect = pygame.Rect(0, 120, WIDTH, HEIGHT - 120)
        pygame.draw.rect(screen, ROAD_COLOR, game_area_rect)

        # Marka Jalan
        for ly in LANES_Y:
            pygame.draw.line(screen, BG_DARK, (0, ly + 40), (WIDTH, ly + 40), 2) 
            for dx in range(0, WIDTH, 40):
                pygame.draw.line(screen, LINE_COLOR, (dx, ly - 20), (dx + 20, ly - 20), 1)

        # GERBANG TOL
        pygame.draw.rect(screen, BG_PANEL, (BATAS_TOL + 60, 100, 30, HEIGHT), border_radius=5)
        for i in range(100, HEIGHT, 40):
            color_stripe = NEON_RED if (i // 40) % 2 == 0 else WHITE
            pygame.draw.rect(screen, color_stripe, (BATAS_TOL + 70, i, 10, 40))

        # Logic Game
        if current_index < JUMLAH_MOBIL:
            prev_car = mobil_list[current_index-1] if current_index > 0 else None
            if prev_car is None or prev_car["x"] > 50:
                mobil_list[current_index]["active"] = True

        selesai_count = 0
        for i, m in enumerate(mobil_list):
            if m["active"]:
                m["x"] += m["speed"]
                
                draw_car_visual(screen, m)

                # Cek Lewat Tol
                if m["x"] > BATAS_TOL:
                    if m["status"] == "":
                        if m["nomor"] in registered_numbers:
                            if m["saldo"] >= MIN_SALDO:
                                m["status"] = "LOLOS"
                                poin_sesi += 10
                                if m["saldo"] > MIN_SALDO:
                                    m["bonus_timer"] = 40
                            else:
                                m["status"] = "SALDO KURANG"
                        else:
                            m["status"] = "TIDAK TERDAFTAR"
                
                if m["status"] != "" and not mobil_list[min(i+1, len(mobil_list)-1)]["active"]:
                     if i + 1 < len(mobil_list):
                         mobil_list[i+1]["active"] = True
                     else:
                         current_index += 1

            if m["x"] > WIDTH + 50:
                selesai_count += 1

        # Cek Apakah Ada Mobil Terdaftar yang Lolos
        if selesai_count == JUMLAH_MOBIL:
            valid_plates = {m["nomor"] for m in mobil_list} 

            # Jika Tidak Ada Mobil Terdaftar yang Lolos, Beri Penalti
            if not any(n in valid_plates for n in registered_numbers):
                poin_total -= 5
                penalti += 5
            else:
                poin_total += poin_sesi

            # Cek Apakah Kondisi Menang Terpenuhi
            if poin_total >= 100:
                current_screen = SCREEN_WIN
            else:
                current_screen = SCREEN_RESULT

        # Render Info Status
        y = 150
        pygame.draw.rect(screen, (0,0,0, 100), (TOL_WIDTH, 120, WIDTH - TOL_WIDTH, HEIGHT), 0)
        
        for m in mobil_list:
            if m["x"] > BATAS_TOL - 50:
                status_color = NEON_GREEN if m["status"] == "LOLOS" else NEON_RED
                if m["status"] == "": status_color = GRAY_TEXT
                
                status_text = m["status"] if m["status"] != "" else "Scanning..."
                
                # Layout Posisi Text Status
                # Karena font kecil, kita geser sedikit agar rapi
                screen.blit(TEXT_FONT.render(f"{m['nomor']}", True, WHITE), (TOL_WIDTH + 40, y))
                screen.blit(TEXT_FONT.render(status_text, True, status_color), (TOL_WIDTH + 170, y))

                if m["bonus_timer"] > 0:
                     screen.blit(TEXT_FONT.render("+10 BONUS", True, YELLOW), (TOL_WIDTH + 320, y))

                y += 28 # Spasi vertikal sedikit dirapatkan karena font kecil

    # ================= RESULT =================
    elif current_screen == SCREEN_RESULT:
        overlay = pygame.Surface((WIDTH, HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BG_DARK)
        screen.blit(overlay, (0,0))

        panel_rect = pygame.Rect(WIDTH//2 - 200, HEIGHT//2 - 150, 400, 300)
        draw_rounded_rect(screen, BG_PANEL, panel_rect, 15)
        pygame.draw.rect(screen, CYAN, panel_rect, 2, border_radius=15)

        sesi_text = TITLE_FONT.render("SESI SELESAI", True, WHITE)
        screen.blit(sesi_text, sesi_text.get_rect(center=(WIDTH//2, HEIGHT//2 - 100)))

        poin_text = SUBTITLE_FONT.render(f"Poin Sesi Ini: {poin_sesi}", True, NEON_GREEN)
        screen.blit(poin_text, poin_text.get_rect(center=(WIDTH//2, HEIGHT//2 - 40)))

        if penalti == 0:
            total_text = SUBTITLE_FONT.render(f"Total Poin Akun: {poin_total}", True, YELLOW)
            screen.blit(total_text, total_text.get_rect(center=(WIDTH//2, HEIGHT//2)))
        else:
            penalti_text = SUBTITLE_FONT.render(f"Penalti Poin: -{penalti}", True, NEON_RED)
            screen.blit(penalti_text, penalti_text.get_rect(center=(WIDTH//2, HEIGHT//2)))

            total_text = SUBTITLE_FONT.render(f"Total Poin Akun: {poin_total}", True, YELLOW)
            screen.blit(total_text, total_text.get_rect(center=(WIDTH//2, HEIGHT//2 + 40)))

        draw_rounded_rect(screen, CYAN, lanjut_button, 10)
        lanjut_text = BUTTON_FONT.render("LANJUT MAIN", True, BG_DARK)
        screen.blit(lanjut_text, lanjut_text.get_rect(center=lanjut_button.center))

            # ================= WIN =================
    elif current_screen == SCREEN_WIN:
        overlay = pygame.Surface((WIDTH, HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BG_DARK)
        screen.blit(overlay, (0,0))

        win_text = TITLE_FONT.render("YOU WIN!", True, NEON_GREEN)
        win_rect = win_text.get_rect(center=(WIDTH//2, HEIGHT//2))
        screen.blit(win_text, win_rect)

        pygame.draw.rect(screen, CYAN, lanjut_button)
        new_game_text = BUTTON_FONT.render("GAME BARU", True, BG_DARK)
        screen.blit(new_game_text, new_game_text.get_rect(center=lanjut_button.center))
        poin_total = 20

    pygame.display.flip()

pygame.quit()
sys.exit()
