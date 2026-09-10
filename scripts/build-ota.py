#!/usr/bin/env python3
import os
import zipfile

def create_ota_bundle():
    dist_dir = 'dist'
    zip_path = 'dist.zip'

    if not os.path.isdir(dist_dir):
        print(f"Error: {dist_dir} directory does not exist. Run 'npm run build' first.")
        exit(1)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(dist_dir):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, dist_dir)
                zf.write(full_path, rel_path)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"✅ Created OTA bundle '{zip_path}' ({size_mb:.2f} MB) with index.html at root.")

if __name__ == '__main__':
    create_ota_bundle()
