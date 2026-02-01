#!/usr/bin/env python3
"""
HexSpec: Magic Number Forensic Tool (CLI Edition)
Designed for Linux terminals.
"""

import os
import sys
import argparse

# Enforcement: Check if running on Linux
if not sys.platform.startswith('linux'):
    print("\033[1;31m[!] FATAL: HexSpec CLI is designed for Linux terminals only.\033[0m")
    sys.exit(1)

# Color Configuration (ANSI)
C = {
    "G": "\033[92m", # Green
    "B": "\033[94m", # Blue
    "Y": "\033[93m", # Yellow
    "R": "\033[91m", # Red
    "C": "\033[96m", # Cyan
    "W": "\033[0m",  # White/Reset
    "BOLD": "\033[1m"
}

BANNER = f"""
{C['G']}{C['BOLD']}
  _    _             _____                    
 | |  | |           / ____|                   
 | |__| | _____  __| (___  _ __   ___  ___ 
 |  __  |/ _ \\ \\/ / \\___ \\| '_ \\ / _ \\/ __|
 | |  | |  __/>  <  ____) | |_) |  __/ (__ 
 |_|  |_|\\___/_/\\_\\|_____/| .__/ \\___|\\___|
                          | |                 
                          |_|                 
{C['W']}{C['C']}Forensic Identification Matrix [Linux Edition]{C['W']}
"""

SIGNATURES = [
    {'hex': '7F454C46', 'desc': 'ELF Executable (Linux)', 'ext': 'elf'},
    {'hex': '4D5A', 'desc': 'DOS MZ / Windows EXE', 'ext': 'exe'},
    {'hex': '89504E470D0A1A0A', 'desc': 'PNG Image', 'ext': 'png'},
    {'hex': 'FFD8FF', 'desc': 'JPEG Image', 'ext': 'jpg'},
    {'hex': '25504446', 'desc': 'PDF Document', 'ext': 'pdf'},
    {'hex': '504B0304', 'desc': 'ZIP / Office OpenXML', 'ext': 'zip'},
    {'hex': '526172211A07', 'desc': 'RAR Archive', 'ext': 'rar'},
    {'hex': '377ABC AF271C', 'desc': '7-Zip Archive', 'ext': '7z'},
    {'hex': 'CAFEBABE', 'desc': 'Java Class / Mach-O', 'ext': 'class'},
    {'hex': '2321', 'desc': 'Shebang / Script', 'ext': 'sh'},
]

def identify_file(file_path):
    if not os.path.exists(file_path):
        print(f"{C['R']}[-] Error: File not found: {file_path}{C['W']}")
        return

    file_size = os.path.getsize(file_path)
    try:
        with open(file_path, 'rb') as f:
            header_bytes = f.read(16)
            hex_string = header_bytes.hex().upper()
    except Exception as e:
        print(f"{C['R']}[-] Error reading file: {e}{C['W']}")
        return

    print(f"\n{C['BOLD']}--- [ FILE METADATA ] ---{C['W']}")
    print(f"Path      : {file_path}")
    print(f"Size      : {file_size} bytes")
    print(f"Signature : {hex_string[:32]}")

    matched = None
    for sig in SIGNATURES:
        clean_sig = sig['hex'].replace(' ', '')
        if hex_string.startswith(clean_sig):
            matched = sig
            break

    print(f"\n{C['BOLD']}--- [ IDENTIFICATION ] ---{C['W']}")
    if matched:
        print(f"{C['G']}[+] Type Detected : {matched['desc']}{C['W']}")
        print(f"{C['G']}[+] True Extension: .{matched['ext']}{C['W']}")
        
        actual_ext = os.path.splitext(file_path)[1].lower().replace('.', '')
        if actual_ext and actual_ext != matched['ext']:
            print(f"{C['R']}[!] ALERT: Extension spoofing detected!{C['W']}")
            print(f"{C['R']}    Declared: .{actual_ext} | Reality: .{matched['ext']}{C['W']}")
    else:
        print(f"{C['Y']}[?] No signature match in local database.{C['W']}")
        print(f"{C['Y']}    This could be a custom binary or unknown format.{C['W']}")

    print(f"\n{C['B']}--- [ EXTERNAL RESOURCES ] ---{C['W']}")
    print(f" {C['C']}*{C['W']} OWASP WebGoat:  https://owasp.org/www-project-webgoat/")
    print(f" {C['C']}*{C['W']} HackTheBox:     https://www.hackthebox.com/")
    print(f" {C['C']}*{C['W']} TryHackMe:      https://tryhackme.com/")
    print(f" {C['C']}*{C['W']} MITRE ATT&CK:   https://attack.mitre.org/")
    print(f"\n{C['G']}Scan complete.{C['W']}\n")

def main():
    parser = argparse.ArgumentParser(description="HexSpec Forensic Tool CLI")
    parser.add_argument("file", help="Path to the file to analyze")
    
    print(BANNER)
    
    if len(sys.argv) < 2:
        parser.print_help()
        sys.exit(1)
        
    args = parser.parse_args()
    identify_file(args.file)

if __name__ == "__main__":
    main()
