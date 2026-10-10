# Notes App (React Native + Expo + Appwrite)

A cross-platform notes application built with React Native and Expo. Users can create an account, log in, and manage their own private notes, which are stored in an Appwrite database.

This project follows the Teknolabs "Cross-Platform Mobile App Development" tutorial (React Native track). The same app was also built with Flutter.

## Features

- Register and login with email and password (Appwrite Auth)
- Add, edit and delete notes
- Notes are saved in the cloud and are still there after a reload
- Each user only sees their own notes (row-level permissions)
- Logout from the Home screen
- Stack navigation between Home and Notes screens

## Tech stack

- React Native with Expo
- React Navigation (stack navigator)
- Appwrite (Auth + Databases / TablesDB)
- JavaScript

## Project structure

```
NotesApp/
├── App.js                  # Navigation + auth gate (login or app)
├── components/
│   ├── NoteItem.js         # One note card with Edit / Delete
│   └── NoteInput.js        # Modal to add or edit a note
├── lib/
│   ├── appwrite.js         # Appwrite client and configuration
│   └── AuthContext.js      # Login, register, logout, current user
└── screens/
    ├── AuthScreen.js       # Login / Register screen
    ├── HomeScreen.js       # Welcome screen
    └── NotesScreen.js      # List of notes with CRUD
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Appwrite

1. Create a project on https://cloud.appwrite.io and add a **Web** platform with hostname `localhost`.
2. Enable **Email/Password** in Auth settings.
3. Create a database and a table with these columns:

| Column    | Type     | Size |
|-----------|----------|------|
| title     | string   | 255  |
| content   | string   | 5000 |
| userId    | string   | 255  |
| createdAt | datetime |      |
| updatedAt | datetime |      |

4. In the table settings, give the **Users** role the **Create** permission and turn **Row security** on.
5. Create a **Key** index on `userId`.
6. Open `lib/appwrite.js` and fill in your own values:

```js
export const config = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "YOUR_PROJECT_ID",
  databaseId: "YOUR_DATABASE_ID",
  tableId: "YOUR_TABLE_ID",
};
```

### 3. Run the app

```bash
npx expo start
```

Then press `w` to open it in the browser, or scan the QR code with the Expo Go app on your phone.

## Author

Yassine Fekih, DSI, ISET Tozeur
