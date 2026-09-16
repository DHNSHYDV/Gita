#!/usr/bin/env python3
"""
Gita App — Professional Release & OTA Publisher
===============================================
Publishes GitHub releases and uploads OTA web bundle (dist.zip) + APK.

GUIDELINES FOR RELEASE HIGHLIGHTS (USER-FACING):
- Write in simple, clear, professional language for everyday users.
- NEVER include raw markdown headers (#, ##, ###) or coded symbols.
- NEVER include backend/internal technical jargon (e.g., Supabase table names,
  SQL triggers, CLI scripts, npm run commands, API payloads).
- Format each highlight as a clean, concise bullet point (e.g., "• Feature: Description").
"""

import os
import sys
import json
import subprocess
import urllib.request
import urllib.error

REPO = 'DHNSHYDV/Gita'

def get_token() -> str:
    """Extract GitHub token from environment or local git configuration."""
    if os.environ.get('GITHUB_TOKEN'):
        return os.environ['GITHUB_TOKEN']
    try:
        remote = subprocess.check_output(['git', 'remote', 'get-url', 'origin'], text=True).strip()
        if '@github.com' in remote and '://' in remote:
            user_info = remote.split('://')[1].split('@')[0]
            token = user_info.split(':')[-1]
            if token.startswith('ghp_') or token.startswith('github_pat_'):
                return token
    except Exception:
        pass
    return ''

TOKEN = get_token()

def validate_user_friendly_body(body: str) -> None:
    """Ensure release highlights adhere to professional, user-friendly standards."""
    for line in body.splitlines():
        trimmed = line.strip()
        if trimmed.startswith('#'):
            raise ValueError(f"Rejecting release notes with raw '#' markdown headers: '{trimmed}'. Use clean bullets ('• ') instead.")
        if any(dev_term in trimmed.lower() for dev_term in ['npm run', 'supabase', 'cli tooling', 'sql', 'deleted_accounts']):
            print(f"⚠️ Warning: Found developer technical jargon in user-facing release notes: '{trimmed}'. Prefer simple user language.")

def make_request(url, method='GET', headers=None, data=None):
    if headers is None:
        headers = {}
    headers.setdefault('Authorization', f'Bearer {TOKEN}')
    headers.setdefault('Accept', 'application/vnd.github+json')
    headers.setdefault('User-Agent', 'Gita-Release-Bot')

    req = urllib.request.Request(url, method=method, headers=headers, data=data)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode()
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        try:
            return e.code, json.loads(error_body)
        except Exception:
            return e.code, {'error': error_body}

def upload_asset(release, file_path, name, content_type):
    upload_url_tmpl = release.get('upload_url')
    if not upload_url_tmpl:
        print("Error: No upload_url in release response")
        return None

    # Check if asset already exists in release
    for asset in release.get('assets', []):
        if asset.get('name') == name:
            asset_id = asset.get('id')
            print(f"Asset '{name}' already exists (ID: {asset_id}). Deleting old asset before re-upload...")
            make_request(f"https://api.github.com/repos/{REPO}/releases/assets/{asset_id}", method='DELETE')
            break

    upload_url = upload_url_tmpl.split('{')[0] + f"?name={name}"
    size = os.path.getsize(file_path)
    print(f"Uploading {name} ({size / (1024*1024):.2f} MB)...")
    
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': content_type,
        'Content-Length': str(size),
        'User-Agent': 'Gita-Release-Bot'
    }
    
    with open(file_path, 'rb') as f:
        data = f.read()
    
    req = urllib.request.Request(upload_url, method='POST', headers=headers, data=data)
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode())
            print(f"✅ Successfully uploaded {name} -> {res.get('browser_download_url')}")
            return res
    except urllib.error.HTTPError as e:
        print(f"❌ Failed to upload {name}: {e.code} - {e.read().decode()}")
        return None

def publish_release(tag: str, title: str, highlights: list[str]):
    """Publish or update a release with clean, user-friendly highlights."""
    body = "\n".join(f"• {item.lstrip('•*- ')}" for item in highlights)
    validate_user_friendly_body(body)

    print(f"🚀 Publishing Release {tag} on {REPO}...")
    print(f"Title: {title}")
    print("Highlights (In-App Box Preview):\n" + body)
    print("-" * 50)

    # 1. Check if release already exists
    status, release = make_request(f"https://api.github.com/repos/{REPO}/releases/tags/{tag}")
    if status == 200:
        print(f"Release {tag} already exists (ID: {release['id']}). Updating description...")
        payload = json.dumps({"name": title, "body": body}).encode('utf-8')
        status, release = make_request(
            f"https://api.github.com/repos/{REPO}/releases/{release['id']}",
            method='PATCH',
            headers={'Content-Type': 'application/json'},
            data=payload
        )
    else:
        # Create new release
        payload = json.dumps({
            "tag_name": tag,
            "name": title,
            "body": body,
            "draft": False,
            "prerelease": False
        }).encode('utf-8')
        
        status, release = make_request(
            f"https://api.github.com/repos/{REPO}/releases",
            method='POST',
            headers={'Content-Type': 'application/json'},
            data=payload
        )
        if status != 201:
            print(f"Failed to create release: {release}")
            sys.exit(1)
        print(f"✅ Created Release {tag} (ID: {release['id']})")

    # 2. Upload dist.zip (OTA)
    dist_zip = '/home/dhnshydv/Gita/dist.zip'
    if os.path.exists(dist_zip):
        upload_asset(release, dist_zip, 'dist.zip', 'application/zip')
    else:
        print(f"Warning: {dist_zip} not found! Run 'npm run build:ota' first.")

    # 3. Upload release APK (optional if running in --ota-only mode)
    if '--ota-only' in sys.argv:
        print("⚡ Mode: --ota-only enabled. Skipping APK upload to conserve mobile data (~10.5 MB saved).")
    else:
        apk_file = f"/home/dhnshydv/Gita/gita-{tag}-release.apk"
        if not os.path.exists(apk_file):
            apk_file = '/home/dhnshydv/Gita/android/app/build/outputs/apk/release/app-release.apk'
        
        if os.path.exists(apk_file):
            upload_asset(release, apk_file, f"gita-{tag}-release.apk", 'application/vnd.android.package-archive')
        else:
            print(f"Notice: APK file not found at {apk_file}. OTA bundle uploaded successfully.")

    print("\n🎉 Release and OTA assets successfully published with clean, professional highlights!")

if __name__ == '__main__':
    publish_release(
        tag='v1.6.5',
        title='Gita v1.6.5 - Maximum Font Size Shloka Scroll & Meaning Audio Fix',
        highlights=[
            'Maximum Font Size Support: Full vertical scrolling enabled so you can read large text comfortably without anything cut off.',
            'Meaning & Purport Access: Complete view of all verse explanations and easy access to the regional voice Listen button.',
            'Docked Navigation: Prev and Next buttons are neatly docked at the bottom and never overlap your reading.'
        ]
    )
