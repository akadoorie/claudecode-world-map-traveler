# Testing Guide

Complete guide to test all features of the World Map Traveler application.

## Prerequisites

Before testing, ensure:
- ✅ Server is running on http://localhost:5000
- ✅ Client is running on http://localhost:3000
- ✅ Browser is open to http://localhost:3000
- ✅ Browser console is open (F12) to monitor for errors

## Test Suite

### Test 1: Initial Load
**Purpose**: Verify the application loads correctly with sample data.

**Steps**:
1. Open http://localhost:3000
2. Wait for the map to load

**Expected Results**:
- ✅ Map appears with light blue oceans
- ✅ Land areas are light gray
- ✅ One country (France) is highlighted in purple/blue
- ✅ Header shows "World Map Traveler"
- ✅ Counter shows "1 Country Visited"
- ✅ Progress indicator shows "1/5"
- ✅ Left arrow is disabled (grayed out)
- ✅ Right arrow is enabled
- ✅ No errors in console

**Screenshot Points**:
- Map with France highlighted
- Counter showing "1"
- Controls showing "1/5"

---

### Test 2: Forward Navigation
**Purpose**: Test navigating forward through travel history.

**Steps**:
1. Press the Right Arrow key (or click right button)
2. Observe the map changes
3. Press Right Arrow again
4. Continue until you reach the end

**Expected Results**:
- ✅ First press: Italy appears highlighted (2 countries now)
- ✅ Counter updates to "2 Countries Visited"
- ✅ Progress shows "2/5"
- ✅ Left arrow becomes enabled
- ✅ Second press: Spain appears (3 countries)
- ✅ Third press: Germany appears (4 countries)
- ✅ Fourth press: Japan appears (5 countries)
- ✅ At end: Right arrow becomes disabled
- ✅ Counter shows "5 Countries Visited"
- ✅ Progress shows "5/5"
- ✅ All visited countries remain highlighted

**Notes**:
- Each country should smoothly appear
- Previous countries stay highlighted
- Transitions are smooth
- No flickering or errors

---

### Test 3: Backward Navigation
**Purpose**: Test navigating backward through travel history.

**Steps**:
1. From the end position (5/5), press Left Arrow key
2. Press Left Arrow multiple times
3. Observe countries disappearing
4. Continue until you reach the start

**Expected Results**:
- ✅ First press: Back to 4/5 (Japan disappears)
- ✅ Counter shows "4 Countries Visited"
- ✅ Second press: 3/5 (Germany disappears)
- ✅ Continue pressing: Countries disappear in reverse order
- ✅ At start: Only France is highlighted
- ✅ Counter shows "1 Country Visited"
- ✅ Progress shows "1/5"
- ✅ Left arrow becomes disabled again

**Notes**:
- Countries should disappear smoothly
- No jarring visual changes
- Counter updates correctly

---

### Test 4: Keyboard Controls
**Purpose**: Verify keyboard navigation works properly.

**Steps**:
1. Click anywhere on the page to ensure focus
2. Press Left Arrow key (should not move at start)
3. Press Right Arrow key (should move forward)
4. Press Left Arrow key (should move backward)
5. Rapidly press Right Arrow multiple times

**Expected Results**:
- ✅ Arrow keys control navigation
- ✅ Disabled directions don't respond
- ✅ Rapid presses work smoothly
- ✅ No lag or stuttering
- ✅ Counter updates in real-time

---

### Test 5: Country Tooltips (Hover)
**Purpose**: Test tooltip display when hovering over countries.

**Steps**:
1. Navigate to position 2/5 (France and Italy visible)
2. Hover mouse over France (should turn lighter)
3. Wait for popup to appear
4. Click on France to pin the popup
5. Read the popup content
6. Close popup (click X or click outside)
7. Hover over Italy
8. Check Italy's popup

**Expected Results - France**:
- ✅ Country highlights brighter on hover
- ✅ Popup appears smoothly
- ✅ Shows "France" as title
- ✅ Shows dates: "2020-01-15 to 2020-01-25"
- ✅ Shows places: "Paris, Alsace"
- ✅ Popup is styled nicely with purple border

**Expected Results - Italy**:
- ✅ Shows "Italy" as title
- ✅ Shows dates: "2020-06-10 to 2020-06-20"
- ✅ Shows places: "Rome, Venice"

**Notes**:
- Hover effect should be immediate
- Popup should be readable and well-styled
- Multiple visits to same country show multiple entries

---

### Test 5A: Place Markers and Google Maps Integration
**Purpose**: Test red place markers and Google Maps links.

**Steps**:
1. Navigate to position 1/5 (France visible)
2. Look for red dots on the map (Paris and Alsace)
3. Click on one of the red dots
4. Read the popup content
5. Click "Open in Google Maps" link
6. Verify Google Maps opens in new tab

**Expected Results**:
- ✅ Red dots visible on map for Paris and Alsace
- ✅ Red dots have white border and shadow
- ✅ Clicking red dot shows popup
- ✅ Popup shows place name (e.g., "Paris")
- ✅ Popup shows country (e.g., "France")
- ✅ Popup shows visit dates
- ✅ Popup has "Open in Google Maps" link at bottom
- ✅ Link is styled in purple color (#667eea)
- ✅ Link has hover effect (background color changes)
- ✅ Clicking link opens Google Maps in new tab
- ✅ Google Maps shows correct location
- ✅ Coordinates match the geocoded location

**Notes**:
- The link should have target="_blank" (opens in new tab)
- Google Maps should center on the exact coordinates
- URL format should be: https://www.google.com/maps?q=lat,lon

---

### Test 6: Country Counter Logic
**Purpose**: Verify unique country counting.

**Steps**:
1. Navigate to 1/5 (France)
2. Note counter: should be 1
3. Navigate to 2/5 (France + Italy)
4. Note counter: should be 2
5. Continue to 5/5
6. Note final counter: should be 5
7. Go back to 1/5
8. Verify counter is 1 again

**Expected Results**:
- ✅ Counter starts at 1
- ✅ Counter increments with each new country
- ✅ Counter correctly counts unique countries
- ✅ Counter decrements when going backward
- ✅ Counter never shows duplicate countries
- ✅ Final count at 5/5 is 5 unique countries

---

### Test 7: Add Country Form - Open/Close
**Purpose**: Test modal form functionality.

**Steps**:
1. Click "+ Add Visit" button in top-right
2. Observe modal appearance
3. Click outside the modal (on the overlay)
4. Verify modal closes
5. Click "+ Add Visit" again
6. Click the X button in top-right of modal
7. Verify modal closes

**Expected Results**:
- ✅ Modal slides up smoothly
- ✅ Background is dimmed (dark overlay)
- ✅ Form appears centered
- ✅ Clicking outside closes modal
- ✅ X button closes modal
- ✅ Animation is smooth
- ✅ Form has all fields visible

---

### Test 8: Add Country Form - Validation
**Purpose**: Test form validation rules.

**Steps**:
1. Open the form
2. Click "Add Visit" without filling anything
3. Observe error message
4. Fill only Country field: "Greece"
5. Click "Add Visit"
6. Observe error about required fields
7. Fill dates: From = "2023-07-10", To = "2023-07-01" (invalid)
8. Click "Add Visit"
9. Observe error about dates

**Expected Results**:
- ✅ Empty form shows error: "Please fill in all required fields"
- ✅ Missing dates show error
- ✅ Invalid date range shows error: "End date must be after start date"
- ✅ Errors appear in red box above form
- ✅ Form doesn't submit with errors

---

### Test 9: Add Country Form - Success
**Purpose**: Test successfully adding a new country.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Greece"
   - From Date: "2023-07-01"
   - To Date: "2023-07-10"
   - Places: "Athens, Santorini"
3. Click "Add Visit"
4. Wait for form to close
5. Press Right Arrow until you reach the last entry
6. Observe Greece is now in the list

**Expected Results**:
- ✅ Form submits successfully
- ✅ Modal closes automatically
- ✅ No error messages
- ✅ New entry appears in timeline (now 6/6)
- ✅ Greece is highlighted on map
- ✅ Counter updates to 6
- ✅ Hovering over Greece shows correct data
- ✅ Data persists after page refresh

**Verification**:
- Refresh the page (F5)
- Navigate to last entry
- Greece should still be there

---

### Test 10: Add Country Form - Empty Places
**Purpose**: Test adding a country without specific places.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Portugal"
   - From Date: "2023-08-15"
   - To Date: "2023-08-20"
   - Places: (leave empty)
3. Click "Add Visit"
4. Navigate to the new entry
5. Hover over Portugal

**Expected Results**:
- ✅ Form submits successfully
- ✅ Portugal appears on map
- ✅ Tooltip shows "Whole country visited" (no places)
- ✅ No errors

---

### Test 11: Multiple Places Parsing
**Purpose**: Test comma-separated places parsing.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Netherlands"
   - From Date: "2023-09-01"
   - To Date: "2023-09-05"
   - Places: "Amsterdam, Rotterdam, The Hague"
3. Submit
4. Navigate to Netherlands
5. Hover over Netherlands
6. Check popup

**Expected Results**:
- ✅ All three places appear in popup
- ✅ Places are separated by commas
- ✅ No extra whitespace
- ✅ Formatting is clean

---

### Test 12: Map Visual Styling
**Purpose**: Verify map appearance matches requirements.

**Checks**:
- ✅ Ocean/seas are light blue (#a8daff or similar)
- ✅ Unvisited land is light gray (#e0e0e0 or similar)
- ✅ Visited countries are purple/blue (#667eea or similar)
- ✅ Country borders are visible
- ✅ Borders are thin gray lines
- ✅ Map is crisp and clear
- ✅ Zoom controls work
- ✅ Dragging works

**Steps**:
1. Visually inspect the map
2. Try zooming in/out
3. Try dragging the map
4. Check color accuracy

---

### Test 13: Responsive Behavior
**Purpose**: Test at different window sizes.

**Steps**:
1. Resize browser window to various widths
2. Check layout at:
   - Full screen (1920px)
   - Medium (1280px)
   - Small (1024px)
3. Verify elements remain accessible

**Expected Results**:
- ✅ Map resizes properly
- ✅ Header remains visible
- ✅ Controls stay centered at bottom
- ✅ Modal form fits on screen
- ✅ No horizontal scrolling
- ✅ All text is readable

---

### Test 14: Error Handling
**Purpose**: Test error scenarios.

**Test A: Server Down**
1. Stop the Flask server
2. Refresh the page
3. Expected: Error message appears
4. Restart server
5. Click "Retry" button
6. Expected: Data loads successfully

**Test B: Network Error**
1. Open browser dev tools
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to add a country
5. Expected: Error message appears

**Test C: Invalid Data**
1. Edit server/countries.txt
2. Add a line with malformed data
3. Restart server
4. Refresh client
5. Expected: App handles gracefully (skips bad line or shows error)

---

### Test 15: Data Persistence
**Purpose**: Verify data survives restarts.

**Steps**:
1. Add a new country: "Sweden"
2. Close browser completely
3. Stop server
4. Restart server
5. Open browser to http://localhost:3000
6. Navigate to your new entry
7. Verify Sweden appears

**Expected Results**:
- ✅ Data is saved to countries.txt
- ✅ Data persists after server restart
- ✅ Data persists after browser close
- ✅ All details are correct

---

### Test 16: Progress Indicator
**Purpose**: Test progress display accuracy.

**Steps**:
1. Start at 1/5
2. Note display shows "1 / 5"
3. Navigate through all positions
4. Check display at each position

**Expected Results**:
- ✅ Position 1: Shows "1 / 5"
- ✅ Position 2: Shows "2 / 5"
- ✅ Position 3: Shows "3 / 5"
- ✅ Position 4: Shows "4 / 5"
- ✅ Position 5: Shows "5 / 5"
- ✅ Numbers are clearly visible
- ✅ Formatting is consistent

---

### Test 17: Button States
**Purpose**: Verify button enabled/disabled states.

**Checks**:
- At position 1/5:
  - ✅ Left button: Disabled (gray, no hover effect)
  - ✅ Right button: Enabled (purple, hover effect)

- At position 3/5:
  - ✅ Left button: Enabled
  - ✅ Right button: Enabled

- At position 5/5:
  - ✅ Left button: Enabled
  - ✅ Right button: Disabled

- Button interactions:
  - ✅ Hover effect only on enabled buttons
  - ✅ Click effect only on enabled buttons
  - ✅ Disabled buttons don't respond to clicks

---

### Test 18: Animation Smoothness
**Purpose**: Verify all animations work smoothly.

**Checks**:
- ✅ Modal open: Smooth slide-up
- ✅ Modal close: Smooth fade-out
- ✅ Button hover: Smooth scale
- ✅ Country hover: Smooth brightness
- ✅ Map transitions: Smooth updates
- ✅ No jarring movements
- ✅ No flickering
- ✅ Consistent timing

---

### Test 19: Console Check
**Purpose**: Verify no errors in console.

**Steps**:
1. Open browser console (F12)
2. Refresh page
3. Navigate through timeline
4. Add a country
5. Check console output

**Expected Results**:
- ✅ No red errors
- ✅ No warnings (or only minor React warnings)
- ✅ API calls show 200 status
- ✅ No CORS errors
- ✅ No 404 errors

---

### Test 20: Full User Journey
**Purpose**: Complete end-to-end test.

**Scenario**: New user explores their travel history and adds a new trip.

**Steps**:
1. Open application
2. See first country (France)
3. Read the counter (1 country)
4. Press Right Arrow 4 times to see all travels
5. Counter now shows 5 countries
6. Hover over each country to see details
7. Press Left Arrow to go back to start
8. Click "+ Add Visit"
9. Add new country: "Australia"
   - From: "2024-01-01"
   - To: "2024-01-15"
   - Places: "Sydney, Melbourne"
10. Navigate to new entry
11. Hover over Australia
12. Verify data is correct
13. Refresh page
14. Navigate back to Australia
15. Verify it still exists

**Expected Results**:
- ✅ Entire flow works smoothly
- ✅ No errors at any point
- ✅ All features work as expected
- ✅ Data persists correctly
- ✅ UI is responsive and professional
- ✅ User experience is intuitive

---

## Test Results Summary

Use this checklist to track your testing:

- [ ] Test 1: Initial Load
- [ ] Test 2: Forward Navigation
- [ ] Test 3: Backward Navigation
- [ ] Test 4: Keyboard Controls
- [ ] Test 5: Country Tooltips
- [ ] Test 5A: Place Markers and Google Maps Integration
- [ ] Test 6: Country Counter Logic
- [ ] Test 7: Add Form - Open/Close
- [ ] Test 8: Add Form - Validation
- [ ] Test 9: Add Form - Success
- [ ] Test 10: Add Form - Empty Places
- [ ] Test 11: Multiple Places Parsing
- [ ] Test 12: Map Visual Styling
- [ ] Test 13: Responsive Behavior
- [ ] Test 14: Error Handling
- [ ] Test 15: Data Persistence
- [ ] Test 16: Progress Indicator
- [ ] Test 17: Button States
- [ ] Test 18: Animation Smoothness
- [ ] Test 19: Console Check
- [ ] Test 20: Full User Journey

---

## Bug Reporting

If you find any issues, note:
1. Test number where issue occurred
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser console errors (if any)
6. Screenshots (if helpful)

---

**All tests should pass! The application has been built to handle all these scenarios correctly.**
