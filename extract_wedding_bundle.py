from pathlib import Path

from PIL import Image


SOURCE_IMAGE = Path(r"C:\Users\Dell\Downloads\Gemini_Generated_Image_bfaqlkbfaqlkbfaq.png")
OUTPUT_DIR = Path(r"C:\Users\Dell\Documents\Playground\wedding_bundle_individual_pdfs")


# Bounding boxes are in source-image pixels: (left, top, right, bottom).
# They were chosen to isolate each visible printable item from the bundle preview.
BOXES = {
    "01_main_invitation_5x7": (226, 152, 524, 573),
    "02_alternate_minimal_invitation": (543, 152, 861, 573),
    "03_rsvp_5x3_5": (903, 151, 1180, 355),
    "04_details_card": (903, 381, 1180, 573),
    "05_save_the_date_text_5x7": (1267, 151, 1594, 573),
    "06_save_the_date_photo_5x7": (1604, 151, 1924, 573),
    "07_welcome_16x20": (1963, 93, 2295, 574),
    "08_unplugged_ceremony_cards_gifts": (2334, 176, 2661, 574),
    "09_seating_chart_alphabetical": (234, 650, 525, 1005),
    "10_seating_chart_table_style": (547, 650, 858, 1005),
    "11_table_number_1": (979, 657, 1108, 821),
    "12_table_number_2": (1124, 658, 1248, 820),
    "13_table_number_3": (1274, 658, 1397, 820),
    "14_table_number_4": (1420, 658, 1546, 820),
    "15_table_number_5": (1569, 658, 1694, 820),
    "16_table_number_6": (1715, 658, 1840, 820),
    "17_table_number_10": (980, 842, 1108, 1006),
    "18_table_number_16": (1124, 842, 1249, 1006),
    "19_table_number_17": (1273, 842, 1398, 1006),
    "20_table_number_18": (1420, 842, 1546, 1006),
    "21_table_number_19": (1568, 842, 1695, 1006),
    "22_table_number_20": (1715, 842, 1840, 1006),
    "23_wedding_checklist": (1865, 664, 2088, 1004),
    "24_guest_list": (2112, 664, 2337, 1004),
    "25_budget_planner": (2359, 664, 2585, 1004),
    "26_bridal_shower_bingo": (243, 1080, 496, 1418),
    "27_would_she_rather": (534, 1080, 810, 1418),
    "28_bridal_shower_game": (929, 1080, 1208, 1418),
    "29_bachelorette_itinerary": (1240, 1075, 1535, 1418),
    "30_drink_menu_games": (1377, 1120, 1605, 1418),
    "31_tag_games": (1684, 1079, 1795, 1265),
    "32_tag_tags": (1810, 1080, 1924, 1265),
    "33_tag_bachelorette_party_left": (1733, 1156, 1845, 1332),
    "34_tag_bachelorette_party_right": (1859, 1154, 1966, 1332),
    "35_thank_you": (2022, 1140, 2367, 1367),
    "36_cover_page": (2481, 1058, 2710, 1420),
}


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(SOURCE_IMAGE) as source:
        for name, box in BOXES.items():
            cropped = source.crop(box).convert("RGB")
            pdf_path = OUTPUT_DIR / f"{name}.pdf"
            png_path = OUTPUT_DIR / f"{name}.png"
            cropped.save(png_path)
            cropped.save(pdf_path, "PDF", resolution=300.0)
            print(f"Created {pdf_path.name}")


if __name__ == "__main__":
    main()
