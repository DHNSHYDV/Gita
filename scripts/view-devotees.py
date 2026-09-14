#!/usr/bin/env python3
import urllib.request
import json

URL = 'https://wjhdjihaddpqydmfmzxa.supabase.co/rest/v1/profiles?select=id,username,streak,last_read,updated_at'
DELETED_URL = 'https://wjhdjihaddpqydmfmzxa.supabase.co/rest/v1/deleted_accounts?select=id,username,points,streak,deleted_at&order=deleted_at.desc'
KEY = 'sb_publishable_PCoa00Qsg_lA-hFMbUVivw_sd6ZGUkC'

try:
    headers = {'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'User-Agent': 'Gita-Admin'}

    # 1. Active Profiles
    req = urllib.request.Request(URL, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
    
    print(f"\n🕉️  GITA APP — LIVE DEVOTEE POINTS & STREAKS ({len(data)} Active)")
    print("=" * 80)
    print(f"{'Rank':<6} | {'Devotee':<22} | {'Points':<8} | {'Streak':<8} | {'Listened':<12} | {'Last Active'}")
    print("-" * 80)
    
    sorted_devotees = sorted(data, key=lambda x: (x.get('last_read') or {}).get('points', 0), reverse=True)
    for i, u in enumerate(sorted_devotees, 1):
        lr = u.get('last_read') or {}
        pts = lr.get('points', 0)
        streak = f"{u.get('streak', 0)}d"
        listened = f"{len(lr.get('listened_verses') or [])} verses"
        updated = (u.get('updated_at') or '')[:10]
        name = u.get('username') or 'Anonymous'
        print(f"#{i:<5} | {name:<22} | {pts:<8} | {streak:<8} | {listened:<12} | {updated}")
    
    print("=" * 80)

    # 2. Deleted Accounts Audit Log
    del_req = urllib.request.Request(DELETED_URL, headers=headers)
    try:
        with urllib.request.urlopen(del_req) as resp:
            deleted_data = json.loads(resp.read().decode())
        
        print(f"\n🗑️  DELETED ACCOUNTS LOG ({len(deleted_data)} Records)")
        print("=" * 80)
        if len(deleted_data) == 0:
            print("No accounts deleted yet. All devotees active! ✨")
        else:
            print(f"{'#':<4} | {'Username':<24} | {'Points':<8} | {'Streak':<8} | {'Deleted At'}")
            print("-" * 80)
            for j, d in enumerate(deleted_data, 1):
                del_time = (d.get('deleted_at') or '')[:19].replace('T', ' ')
                print(f"#{j:<3} | {d.get('username') or 'Devotee':<24} | {d.get('points', 0):<8} | {d.get('streak', 0)}d{'':<6} | {del_time} UTC")
        print("=" * 80)
    except Exception as del_err:
        print("Could not query deleted_accounts:", del_err)

    print("Note: Guest / offline users store points locally until they sign in with Google.\n")

except Exception as e:
    print("Error fetching devotee data:", e)
