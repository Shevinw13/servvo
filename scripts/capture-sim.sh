#!/bin/bash
# Servvo Mobile App - Simulator Screenshot Capture
# Captures all tabs for each industry vertical
# Tab bar positions (iPhone 15 Pro logical points: 393x852)
# Tab bar y position: ~835 (near bottom)
# 4 tabs evenly spaced: Home(~50), Schedule(~148), Messages(~246), Account(~344)

OUTPUT_DIR="$HOME/Desktop/servvo-captures/mobile"
mkdir -p "$OUTPUT_DIR"

# Tab X positions (4 tabs across 393pt width)
HOME_X=50
SCHEDULE_X=148
MESSAGES_X=246
ACCOUNT_X=344
TAB_Y=835

# Dropdown position (top of screen, roughly)
DROPDOWN_X=197
DROPDOWN_Y=60

# Function to tap at coordinates
tap() {
  xcrun simctl io booted tap "$1" "$2" 2>/dev/null
  sleep 1.5
}

# Function to screenshot
screenshot() {
  local name="$1"
  xcrun simctl io booted screenshot "$OUTPUT_DIR/$name.png" 2>/dev/null
  echo "📸 Captured: $name"
}

# Function to capture all tabs for current vertical
capture_tabs() {
  local prefix="$1"
  
  # Home tab
  tap $HOME_X $TAB_Y
  sleep 1
  screenshot "${prefix}-01-home"
  
  # Schedule tab
  tap $SCHEDULE_X $TAB_Y
  sleep 1
  screenshot "${prefix}-02-schedule"
  
  # Messages tab
  tap $MESSAGES_X $TAB_Y
  sleep 1
  screenshot "${prefix}-03-messages"
  
  # Account tab
  tap $ACCOUNT_X $TAB_Y
  sleep 1
  screenshot "${prefix}-04-account"
  
  # Tap Billing inside Account (roughly middle of screen where Billing row would be)
  tap 197 400
  sleep 1.5
  screenshot "${prefix}-05-billing"
  
  # Go back (tap back arrow top-left)
  tap 30 60
  sleep 1
}

echo "🚀 Starting Servvo mobile screenshot capture..."
echo "   Output: $OUTPUT_DIR"
echo ""

# First, make sure we're on the Home tab
tap $HOME_X $TAB_Y
sleep 1

# === VERTICAL 1: GreenScape Lawn (default) ===
echo ""
echo "🌿 Capturing: GreenScape Lawn"
capture_tabs "greenscape-lawn"

# === Switch to HVAC ===
echo ""
echo "❄️  Switching to: Elite Air HVAC"
# Go to Home first
tap $HOME_X $TAB_Y
sleep 1
# Tap the dropdown at top
tap $DROPDOWN_X $DROPDOWN_Y
sleep 1
# Tap HVAC option (second item in dropdown, roughly y=120)
tap $DROPDOWN_X 130
sleep 1.5

echo "❄️  Capturing: Elite Air HVAC"
capture_tabs "elite-air-hvac"

# === Switch to Pest Control ===
echo ""
echo "🛡️  Switching to: Shield Pest Control"
# Go to Home first
tap $HOME_X $TAB_Y
sleep 1
# Tap the dropdown at top
tap $DROPDOWN_X $DROPDOWN_Y
sleep 1
# Tap Pest Control option (third item, roughly y=180)
tap $DROPDOWN_X 190
sleep 1.5

echo "🛡️  Capturing: Shield Pest Control"
capture_tabs "shield-pest-control"

echo ""
echo "🎉 Done! All screenshots saved to: $OUTPUT_DIR"
echo ""
ls -la "$OUTPUT_DIR"/*.png | wc -l
echo " screenshots captured"
