import os
from PIL import Image, ImageFilter

def make_transparent(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    # Get sample of top-left corner color as background
    bg_r, bg_g, bg_b, _ = img.getpixel((0, 0))

    new_data = []
    for item in datas:
        # Distance from background color
        r_diff = abs(item[0] - bg_r)
        g_diff = abs(item[1] - bg_g)
        b_diff = abs(item[2] - bg_b)

        if r_diff < tolerance and g_diff < tolerance and b_diff < tolerance:
            # Fully transparent
            new_data.append((255, 255, 255, 0))
        elif r_diff < tolerance + 20 and g_diff < tolerance + 20 and b_diff < tolerance + 20:
            # Smooth edge antialiasing
            alpha = int(((r_diff + g_diff + b_diff) / (3 * 20)) * 255)
            new_data.append((item[0], item[1], item[2], min(255, alpha)))
        else:
            new_data.append(item)

    img.putdata(new_data)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Processed: {output_path}")

brain_dir = r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a"
app_chars = r"C:\Users\Admin\.gemini\antigravity\scratch\daughter-quest-app\assets\characters"
app_rewards = r"C:\Users\Admin\.gemini\antigravity\scratch\daughter-quest-app\assets\rewards"

tasks = [
    (os.path.join(brain_dir, "danika_full_casual_1790451097943.jpg"), os.path.join(app_chars, "danika_casual.png"), 28),
    (os.path.join(brain_dir, "danika_full_skater_1790451126405.jpg"), os.path.join(app_chars, "danika_skater.png"), 28),
    (os.path.join(brain_dir, "danika_full_explorer_1790451408899.jpg"), os.path.join(app_chars, "danika_explorer.png"), 28),
    (os.path.join(brain_dir, "bruno_full_happy_1790451176839.jpg"), os.path.join(app_chars, "bruno_happy.png"), 28),
    (os.path.join(brain_dir, "bruno_full_skater_1790451242554.jpg"), os.path.join(app_chars, "bruno_skater.png"), 28),
    (os.path.join(brain_dir, "bruno_full_flower_1790451434685.jpg"), os.path.join(app_chars, "bruno_flower.png"), 28),
    (os.path.join(brain_dir, "reward_youtube_ticket_1790451457194.jpg"), os.path.join(app_rewards, "ticket_youtube.png"), 25),
    (os.path.join(brain_dir, "reward_roblox_ticket_1790451477396.jpg"), os.path.join(app_rewards, "ticket_gaming.png"), 25)
]

for in_p, out_p, tol in tasks:
    if os.path.exists(in_p):
        make_transparent(in_p, out_p, tol)
    else:
        print(f"Not found: {in_p}")
