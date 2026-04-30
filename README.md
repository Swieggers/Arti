# Arti Workout Tracker

A simple static web app to help Arti track exercise sets with reps, weight, notes, and video links.

## Features

- Add a workout entry with:
  - exercise name
  - reps
  - weight
  - optional video link
  - optional notes
- View and manage workout log entries
- Delete individual entries or clear the full log
- Data is saved locally using `localStorage`

## Files

- `index.html` — main app page
- `styles.css` — layout and styling
- `script.js` — form handling, storage, and rendering

## Usage

1. Open `index.html` in a browser.
2. Fill in the exercise details and click **Save Entry**.
3. Use the exercise log to review workouts and open linked videos.

## GitHub Pages Hosting

1. Push the repository to GitHub.
2. In the repository settings, go to **Pages**.
3. Choose the `main` branch and the root folder (`/`).
4. Save the settings.
5. Your site will be available at `https://<your-username>.github.io/Arti/` once published.

## Notes

- This app is fully client-side and does not require a backend.
- Workout entries are stored in the browser, so they stay available on the same device and browser.
- For best results, use a modern browser like Chrome, Edge, or Firefox.
