import os

fide_dir = "./react-app/src/Gallery/FIDE RATED"
memories_dir = "./react-app/src/Gallery/OTHER PHOTOS"

bucket_base = "https://storage.googleapis.com/chess-club-iitk-media/Gallery"

sql_statements = []

# Generate FIDE inputs
if os.path.exists(fide_dir):
    for filename in os.listdir(fide_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            url = f"{bucket_base}/FIDE RATED/{filename}".replace(" ", "%20")
            sql_statements.append(f"('{url}', 'Tournaments', 'FIDE_RATED')")

# Generate Memories inputs
if os.path.exists(memories_dir):
    for filename in os.listdir(memories_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            url = f"{bucket_base}/OTHER PHOTOS/{filename}".replace(" ", "%20")
            # You can quickly adjust categories later in SQL if needed
            sql_statements.append(f"('{url}', 'Socials', 'CLUB_MEMORIES')")

if sql_statements:
    print("INSERT INTO gallery (image_url, category, album_type) VALUES")
    print(",\n".join(sql_statements) + ";")