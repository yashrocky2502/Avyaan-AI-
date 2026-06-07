import requests
import pandas as pd
import json
import time
from rocketry import Rocketry
from rocketry.conds import every

app = Rocketry(config={"task_execution": "async"})

TARGET_URL = "https://www.investorgain.com/report/live-ipo-gmp/331/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def scrape_live_ipo_data():
    try:
        print("[*] Contacting tracker data networks...")
        response = requests.get(TARGET_URL, headers=HEADERS, timeout=15)
        
        if response.status_code != 200:
            print(f"[!] Server connection failed. Status: {response.status_code}")
            return None
            
        # Extract tables natively using pandas parsing logic
        tables = pd.read_html(response.text)
        if not tables:
            print("[!] No visual data structures found on page layout.")
            return None
            
        # Target the primary summary dataframe (usually the largest or first table)
        # Search for the table that actually contains IPO names or GMP
        df = None
        for table in tables:
            cols = [str(c).lower() for c in table.columns]
            if any('ipo' in c for c in cols) or any('gmp' in c for c in cols):
                df = table
                break
        
        if df is None:
            df = tables[0]
            
        # Standardize structural columns cleanly to prevent naming mismatches
        df.columns = [str(col).strip().lower() for col in df.columns]
        return df
        
    except Exception as e:
        print(f"[!] Scraper exception encountered: {str(e)}")
        return None

def process_and_save_feed(df):
    if df is None or df.empty:
        print("[-] Dataframe empty. Skipping file sync.")
        return

    parsed_feed = []
    
    # Dynamically match column variations commonly found on track pages
    name_col = next((c for c in df.columns if 'ipo' in c or 'company' in c), None)
    gmp_col = next((c for c in df.columns if 'gmp' in c), None)
    sub_col = next((c for c in df.columns if 'sub' in c or 'times' in c), None)
    date_col = next((c for c in df.columns if 'date' in c or 'period' in c or 'open' in c), None)

    for _, row in df.iterrows():
        raw_name = str(row.get(name_col, "Unknown Issue"))
        
        # Clean up text noise (like trailing links or internal system notes)
        clean_name = raw_name.split("Details")[0].strip() if "Details" in raw_name else raw_name
        if not clean_name or "nan" in clean_name.lower() or "unknown" in clean_name.lower():
            continue

        # Extract type labels based on textual footprints
        issue_type = "SME IPO" if "sme" in raw_name.lower() else "Mainboard IPO"

        parsed_feed.append({
            "company_name": clean_name.replace("SME", "").strip(),
            "type": issue_type,
            "gmp": str(row.get(gmp_col, "N/A")).strip(),
            "subscription": str(row.get(sub_col, "--")).strip(),
            "dates": str(row.get(date_col, "TBA")).strip()
        })

    # Atomically overwrite the local JSON storage file
    with open("ipo_feed.json", "w") as f:
        json.dump(parsed_feed, f, indent=4)
    print(f"[✓] App database synchronized. Packed {len(parsed_feed)} active issues.")

@app.task(every("15 minutes"))
def execution_cycle():
    print(f"\n[*] Execution loop initialized at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    dataframe = scrape_live_ipo_data()
    process_and_save_feed(dataframe)

if __name__ == "__main__":
    print("[▶] Background Scraper Engine Active. Tracking on 15-minute intervals...")
    # Trigger an immediate fetch on startup
    initial_df = scrape_live_ipo_data()
    process_and_save_feed(initial_df)
    app.run()
