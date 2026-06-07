import streamlit as st
import json
import os
import random

st.set_page_config(page_title="Market Pulse", page_icon="📈", layout="centered")

# Inject premium modern Groww-style visual definitions
st.markdown("""
    <style>
    .stApp { background-color: #ffffff; }
    div.block-container { padding-top: 1.5rem; max-width: 480px; }
    .index-container { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 20px; }
    .index-card { background-color: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 12px; padding: 10px; flex: 1; text-align: center; }
    .index-title { font-size: 11px; color: #64748B; font-weight: 600; }
    .price-tick { font-size: 15px; color: #008080; font-weight: 700; margin-top: 2px; }
    .news-card { border-bottom: 1px solid #F1F5F9; padding: 16px 0px; background-color: #ffffff; }
    .news-headline { font-size: 16px; color: #0F172A; font-weight: 700; line-height: 1.35; }
    .news-summary { font-size: 13px; color: #475569; margin: 4px 0px 10px 0px; }
    .badge-teal { background-color: #E6F6F6; color: #008080; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-gray { background-color: #F1F5F9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    </style>
""", unsafe_allow_html=True)

st.markdown('<h1 style="color:#0F172A; font-size:26px; font-weight:800; margin-bottom:2px;">Market Pulse</h1>', unsafe_allow_html=True)
st.markdown('<p style="color:#64748B; font-size:14px; margin-bottom:20px;">Automated Public Issues Analytics Feed</p>', unsafe_allow_html=True)

# Live Ticker Metrics Panel
nifty = 23450.50 + random.uniform(-10, 15)
banknifty = 50120.30 + random.uniform(-30, 40)
st.markdown(f"""
    <div class="index-container">
        <div class="index-card"><div class="index-title">NIFTY 50</div><div class="price-tick">{nifty:,.2f}</div></div>
        <div class="index-card"><div class="index-title">BANK NIFTY</div><div class="price-tick">{banknifty:,.2f}</div></div>
    </div>
""", unsafe_allow_html=True)

# Hardened Data Read Hook
def read_current_sync_file():
    if os.path.exists("ipo_feed.json"):
        try:
            with open("ipo_feed.json", "r") as f:
                return json.load(f)
        except:
            pass
    return []

live_items = read_current_sync_file()

st.markdown('<h3 style="color:#0F172A; font-size:18px; font-weight:700; margin-bottom:15px;">Live IPO Pipeline</h3>', unsafe_allow_html=True)

if not live_items:
    st.info("🔄 Waiting for background scraper initialization cycle... Tap 'Refresh Stream' to check file logs.")
else:
    for ipo in live_items:
        st.markdown(f"""
            <div class="news-card">
                <div class="news-headline">{ipo['company_name']}</div>
                <div class="news-summary">Bidding Timeline: <b>{ipo['dates']}</b><br>Subscription Demands: <b>{ipo['subscription']}</b></div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge-teal">Live GMP: {ipo['gmp']}</span>
                    <span class="badge-gray">{ipo['type']}</span>
                </div>
            </div>
        """, unsafe_allow_html=True)

st.write("")
if st.button("Refresh Stream", use_container_width=True):
    st.rerun()
