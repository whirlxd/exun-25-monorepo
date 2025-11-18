# VERY VERY W.I.P AND ROUGH
# TODO: sync to api and compute
# TODO: convert to scr and buildstep
import pygame  # type: ignore USE 3.11
import random
import time
import math
from collections import deque

DEV_MODE = True  # ONLY close on q or esc
FPS = 30
FULLSCREEN = True
TITLE = "etinuxE Influence Grid "


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def lerp(a, b, t):
    return a + (b - a) * t


def run():
    pygame.init()
    info = pygame.display.Info()
    width, height = info.current_w, info.current_h

    flags = pygame.FULLSCREEN if FULLSCREEN else 0
    screen = pygame.display.set_mode((width, height), flags)
    pygame.display.set_caption(TITLE)
    pygame.mouse.set_visible(False)

    clock = pygame.time.Clock()
    rng = random.Random()
    font = pygame.font.SysFont("Consolas", 20)
    small_font = pygame.font.SysFont("Consolas", 14)
    COL_BG = (0, 0, 0)
    COL_FRAME = (40, 90, 40)
    COL_TEXT = (220, 255, 220)
    COL_DIM = (120, 170, 120)
    COL_ACCENT = (120, 255, 200)
    COL_ACCENT2 = (180, 120, 255)
    COL_DANGER = (255, 90, 120)
    COL_GOOD = (140, 255, 140)

    padding = 20
    top_h = height * 2 // 5
    bottom_h = height - top_h - padding

    influence_rect = pygame.Rect(padding, padding, width // 2 - 2 * padding,
                                 top_h - padding)
    ops_rect = pygame.Rect(width // 2, padding, width // 2 - 2 * padding,
                           top_h - padding)
    funds_rect = pygame.Rect(padding, top_h, width // 2 - 2 * padding,
                             bottom_h - padding)
    scanner_rect = pygame.Rect(width // 2, top_h, width // 2 - 2 * padding,
                               bottom_h - padding)

    sectors = [[rng.uniform(0.3, 0.7) for _ in range(4)] for _ in range(4)]
    sector_targets = [[rng.uniform(0.0, 1.0) for _ in range(4)]
                      for _ in range(4)]

    ops_log = deque(maxlen=10)

    def log_op(text):
        ts = time.strftime("%H:%M:%S")
        ops_log.appendleft(f"[{ts}] {text}")


# TODO: write ts

    op_templates = [
        "CASINO SKEW – ODDS SHIFTED {delta:.2f}% – STATUS: CLEAN",
        "TARGET-{id} CARDIAC EVENT – STATUS: PLAUSIBLE",
        "POLICY VOTE COUNT DRIFT – STATUS: UNTRACEABLE",
        "CAMPAIGN SERVER GLITCH – STATUS: NON-ATTRIBUTABLE",
        "SURVEILLANCE NODE BLIND SPOT – STATUS: ACTIVE",
        "LOTTERY JACKPOT REDIRECTED – STATUS: WASHED",
        "KEY WITNESS TESTIMONY – STATUS: DENIABLE",
        "PARLIAMENT FEED INTERRUPTION – STATUS: PATCHED",
    ]

    def random_op_line():
        t = random.choice(op_templates)
        return t.format(
            delta=rng.uniform(0.15, 0.85),
            id=rng.randint(10, 99),
        )

    for _ in range(6):
        log_op(random_op_line())

    total_funds = 12.0
    channel_names = ["CASINOS", "MARKETS", "BLACK CONTRACTS", "FRONTS"]
    channel_values = [0.45, 0.25, 0.20, 0.10]
    channel_targets = [v for v in channel_values]

    sweep_angle = 0.0
    cat_nodes = []
    node_types = ["SETTLEMENT", "MOVEMENT", "BREACH", "FLOW"]

    for _ in range(10):
        cat_nodes.append({
            "angle": rng.uniform(0, math.tau),
            "radius": rng.uniform(0.25, 1.0),
            "type": rng.choice(node_types),
            "intensity": rng.uniform(0.4, 1.0)
        })

    lore_messages = [
        "// NMIPC REQUEST: INCREASE CAMPAIGN FUNDS FOR CONSTITUTIONAL PUSH",
        "// NEW POLL: PUBLIC SUPPORT FOR MICRO RIGHTS +{delta:.1f}%",
        "// INTERNAL: MICRO-ASSISTED OPS CLASSIFIED AS 'NON-EXISTENT'",
        "// CABINET WHIP CONTACTED – MESSAGE: 'YOU NEED US'",
        "// MEDIA NARRATIVE SHIFT: 'MICRO RIGHTS' SEGMENT APPROVED",
        "// ETINUXE DIRECTIVE: REDUCE OPERATIONAL FOOTPRINT IN SECTOR B2",
    ]
    current_lore = ""

    start_time = time.time()
    last_sector_update = time.time()
    last_fund_update = time.time()
    last_op_update = time.time()
    last_lore_change = time.time()

    running = True

    def draw_frame_with_title(rect, title):
        pygame.draw.rect(screen, COL_FRAME, rect, 1)
        label = f"[{title}]"
        text_surf = font.render(label, True, COL_ACCENT)
        screen.blit(text_surf, (rect.x + 8, rect.y + 4))

    def influence_color(v):
        r = int(lerp(10, 100, v))
        g = int(lerp(80, 255, v))
        b = int(lerp(40, 220, v))
        return (r, g, b)

    def draw_influence_grid(rect):
        title_y = rect.y + 34
        subtitle = small_font.render(
            "MACRO CITY SECTORS – ETINUXE INFLUENCE LEVEL", True, COL_DIM)
        screen.blit(subtitle, (rect.x + 10, title_y))

        grid_top = title_y + subtitle.get_height() + 10
        grid_height = rect.bottom - grid_top - 40
        grid_width = rect.width - 40
        cell_w = grid_width // 4
        cell_h = grid_height // 4

        for r in range(4):
            for c in range(4):
                x = rect.x + 20 + c * cell_w
                y = grid_top + r * cell_h
                val = sectors[r][c]
                col = influence_color(val)

                cell_rect = pygame.Rect(x, y, cell_w - 8, cell_h - 8)
                pygame.draw.rect(screen, (15, 40, 20), cell_rect)

                inner_h = cell_rect.height - 16
                bar_h = int(inner_h * val)
                bar_y = cell_rect.bottom - 4 - bar_h
                bar_rect = pygame.Rect(cell_rect.x + 4, bar_y,
                                       cell_rect.width - 8, bar_h)
                pygame.draw.rect(screen, col, bar_rect)

                sector_label = f"{chr(65 + r)}{c+1}"
                lab_surf = small_font.render(sector_label, True, COL_TEXT)
                screen.blit(lab_surf, (cell_rect.x + 6, cell_rect.y + 4))

        legend_y = rect.bottom - 24
        low = small_font.render("LOW INFLUENCE", True, COL_DIM)
        high = small_font.render("HIGH INFLUENCE", True, COL_DIM)
        screen.blit(low, (rect.x + 20, legend_y))
        screen.blit(high, (rect.right - high.get_width() - 20, legend_y))

    def draw_ops_ticker(rect):
        subtitle = small_font.render("ACTIVE / RECENT OPERATIONS", True,
                                     COL_DIM)
        screen.blit(subtitle, (rect.x + 10, rect.y + 34))

        x = rect.x + 10
        y = rect.y + 34 + subtitle.get_height() + 8

        max_lines = (rect.height -
                     (y - rect.y) - 10) // (small_font.get_height() + 4)
        lines = list(ops_log)[:max_lines]

        for line in lines:

            surf = small_font.render(line, True, COL_TEXT)
            if surf.get_width() > rect.width - 20:

                while surf.get_width() > rect.width - 40 and len(line) > 4:
                    line = line[:-4] + "..."
                    surf = small_font.render(line, True, COL_TEXT)
            screen.blit(surf, (x, y))
            y += small_font.get_height() + 4

    def draw_funds(rect):
        nonlocal total_funds

        t = time.time() - start_time
        base = 11.8
        drift = 0.6 * math.sin(t * 0.08)
        total_funds = base + drift

        title = small_font.render("FUNDING ROUTES → NMIPC", True, COL_DIM)
        screen.blit(title, (rect.x + 10, rect.y + 34))

        big = font.render(f"TOTAL ROUTED: {total_funds:5.1f}M NUX", True,
                          COL_ACCENT)
        screen.blit(big, (rect.x + 10, rect.y + 34 + title.get_height() + 8))

        bar_area_top = rect.y + 34 + title.get_height() + big.get_height() + 20
        bar_area_height = rect.bottom - bar_area_top - 20

        bar_h = min(30, bar_area_height // (len(channel_names) + 1))
        gap = 12

        for i, name in enumerate(channel_names):
            val = channel_values[i]
            label = small_font.render(name, True, COL_TEXT)
            y = bar_area_top + i * (bar_h + gap)
            screen.blit(label, (rect.x + 10, y))

            bar_w = rect.width - 150
            x_bar = rect.x + 130

            pygame.draw.rect(screen, COL_DIM, (x_bar, y, bar_w, bar_h), 1)

            fill_w = int(bar_w * clamp(val, 0.0, 1.0))
            col = COL_ACCENT if name != "BLACK CONTRACTS" else COL_DANGER
            if fill_w > 0:
                pygame.draw.rect(screen, col,
                                 (x_bar + 1, y + 1, fill_w - 2, bar_h - 2))

            perc_text = f"{int(val * 100)}%"
            perc_surf = small_font.render(perc_text, True, COL_TEXT)
            px = x_bar + min(fill_w - perc_surf.get_width() - 4,
                             bar_w - perc_surf.get_width() - 4)
            px = max(px, x_bar + 4)
            py = y + (bar_h - perc_surf.get_height()) // 2
            screen.blit(perc_surf, (px, py))

    def draw_scanner(rect, angle):

        title = small_font.render("CATACOMB ACTIVITY SCANNER", True, COL_DIM)
        screen.blit(title, (rect.x + 10, rect.y + 34))

        margin = 30
        radar_size = min(rect.width, rect.height - 70) - margin * 2
        radar_size = max(radar_size, 80)
        radar_x = rect.x + (rect.width - radar_size) // 2
        radar_y = rect.y + 34 + title.get_height() + 10
        cx = radar_x + radar_size // 2
        cy = radar_y + radar_size // 2
        radius = radar_size // 2

        for i in range(1, 4):
            pygame.draw.circle(screen, COL_DIM, (cx, cy), int(radius * i / 3),
                               1)

        pygame.draw.line(screen, COL_DIM, (cx - radius, cy), (cx + radius, cy),
                         1)
        pygame.draw.line(screen, COL_DIM, (cx, cy - radius), (cx, cy + radius),
                         1)

        sweep_len = radius
        sx = cx + int(math.cos(angle) * sweep_len)
        sy = cy + int(math.sin(angle) * sweep_len)
        pygame.draw.line(screen, COL_ACCENT2, (cx, cy), (sx, sy), 2)

        for node in cat_nodes:
            node_angle = node["angle"]
            node_r = node["radius"] * radius
            nx = cx + int(math.cos(node_angle) * node_r)
            ny = cy + int(math.sin(node_angle) * node_r)

            if node["type"] == "SETTLEMENT":
                base_col = COL_GOOD
            elif node["type"] == "MOVEMENT":
                base_col = COL_ACCENT
            elif node["type"] == "BREACH":
                base_col = COL_DANGER
            else:
                base_col = (120, 200, 255)

            diff = abs((angle - node_angle + math.pi) % (2 * math.pi) -
                       math.pi)
            if diff < 0.25:
                intensity = 1.0
                size = 6
            else:
                intensity = 0.4
                size = 4

            col = tuple(int(c * intensity) for c in base_col)
            pygame.draw.circle(screen, col, (nx, ny), size)

        legend_y = radar_y + radar_size + 12
        lines = [
            "● SETTLEMENT    × MOVEMENT    ? BREACH    ~ FLOW",
            "SWEEP ARM = LIVE SENSOR PASS | BRIGHTER = RECENT ACTIVITY"
        ]
        icons_line = lines[0]
        info_line = lines[1]

        icons_surf = small_font.render(icons_line, True, COL_DIM)
        info_surf = small_font.render(info_line, True, COL_DIM)

        screen.blit(icons_surf,
                    (rect.x +
                     (rect.width - icons_surf.get_width()) // 2, legend_y))
        screen.blit(info_surf,
                    (rect.x + (rect.width - info_surf.get_width()) // 2,
                     legend_y + icons_surf.get_height() + 2))

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN:
                if event.key in (pygame.K_ESCAPE, pygame.K_q):
                    running = False
                elif not DEV_MODE:
                    running = False

            elif event.type == pygame.MOUSEBUTTONDOWN and not DEV_MODE:
                running = False

        now = time.time()

        if now - last_sector_update > 5.0:
            last_sector_update = now
            for r in range(4):
                for c in range(4):
                    sector_targets[r][c] = clamp(
                        sectors[r][c] + rng.uniform(-0.3, 0.3), 0.0, 1.0)

        for r in range(4):
            for c in range(4):
                sectors[r][c] = lerp(sectors[r][c], sector_targets[r][c], 0.03)

        if now - last_fund_update > rng.uniform(8.0, 12.0):
            last_fund_update = now
            for i in range(len(channel_values)):
                channel_targets[i] = clamp(
                    channel_values[i] + rng.uniform(-0.15, 0.15), 0.05, 0.7)
            s = sum(channel_targets)
            if s > 0:
                for i in range(len(channel_values)):
                    channel_targets[i] = channel_targets[i] / s

        for i in range(len(channel_values)):
            channel_values[i] = lerp(channel_values[i], channel_targets[i],
                                     0.04)

        if now - last_op_update > 4.0:
            last_op_update = now
            log_op(random_op_line())

        if now - last_lore_change > rng.uniform(10.0, 18.0):
            last_lore_change = now
            msg = rng.choice(lore_messages)
            if "{delta" in msg:
                msg = msg.format(delta=rng.uniform(0.5, 3.5))
            current_lore = msg

        sweep_angle = (sweep_angle + 0.04) % (2 * math.pi)

        screen.fill(COL_BG)

        draw_frame_with_title(influence_rect, "NMICP MACRO INFLUENCE GRID")
        draw_frame_with_title(ops_rect, "OPERATIONS FEED – INTERNAL")
        draw_frame_with_title(funds_rect, "FINANCIAL FLOWS INTO NMIPC")
        draw_frame_with_title(scanner_rect,
                              "CATACOMB OPERATIONS – INTERNAL SCAN")

        draw_influence_grid(influence_rect)
        draw_ops_ticker(ops_rect)
        draw_funds(funds_rect)
        draw_scanner(scanner_rect, sweep_angle)

        if current_lore:
            surf = small_font.render(current_lore, True, COL_ACCENT2)
            screen.blit(surf, (width // 2 - surf.get_width() // 2,
                               height - surf.get_height() - 10))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.mouse.set_visible(True)
    pygame.quit()

if __name__ == "__main__":
    run()
