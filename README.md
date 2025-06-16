# 📱 MindCheck - Frontend (React Native + Expo)

Interface mobile de MindCheck permettant à l’utilisateur d’enregistrer et suivre ses humeurs.

## 🚀 Lancer l'application

```bash
npm install
npx expo start
```

## ⚙️ Configuration de l’API

Dans le fichier `src/services/api.js`, modifiez l'URL comme suit :

```js
const API_BASE_URL = 'http://172.20.10.2:3000/api'; // IP locale de ton backend
```

⚠️ Assurez-vous que votre téléphone et ordinateur soient sur le **même réseau Wi-Fi**.

## 🧪 Fonctionnalités principales

- Authentification (login/register)
- Sélection et enregistrement d'humeurs (Log Screen)
- Ajout de notes optionnelles
- Historique interactif avec calendrier
