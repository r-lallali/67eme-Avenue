# 67ème Avenue 🛍️

> **🚨 Note Importante :** Ce projet est un **site e-commerce factice** (mockup) réalisé dans le cadre d'un portfolio interactif. Aucune vraie commande ni paiement réel n'est traité sur cette plateforme.

Bienvenue sur le dépôt de **67ème Avenue**, une plateforme e-commerce vitrine moderne, rapide et élégante. Conçue pour offrir une expérience utilisateur haut-de-gamme, cette application de démonstration met en lumière les meilleures pratiques de développement web actuelles, de la navigation optimisée avec animations subtiles jusqu'à la gestion sécurisée d'une base de données relationnelle.

## ✨ Fonctionnalités Principales

- **Catalogue de Produits Dynamique** : Parcourez les articles avec une interface réactive et des temps de chargement instantanés.
- **Panier d'Achat Interactif** : Ajout, modification et suppression d'articles via un tiroir latéral (Cart Drawer) fluide, géré avec un état global performant.
- **Système de Commande (Checkout)** : Tunnel de commande complet et intuitif, simulant le processus d'achat de bout en bout.
- **Authentification & Comptes Utilisateurs** : Inscription et connexion sécurisées permettant de gérer les sessions clients.
- **Formulaire de Contact** : Intégration d'un système d'envoi d'emails transactionnels avec gestion des requêtes entrantes.
- **Design Réactif & Animations** : Une interface moderne (UI/UX) qui s'adapte à tous les écrans, sublimée par des micro-interactions soignées.
- **Performances & SEO** : Core Web Vitals optimisés, rendu hybride (SSR/SSG/Server Actions) grâce au App Router de Next.js.

## 🛠️ Stack Technique

Ce projet s'appuie sur une architecture Full-Stack moderne :

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Frontend** : React 19, [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Gestion d'État** : [Zustand](https://zustand-demo.pmnd.rs/)
- **Base de données & ORM** : PostgreSQL, [Prisma](https://www.prisma.io/)
- **Authentification** : [NextAuth.js](https://next-auth.js.org/)
- **Emails** : [Brevo API](https://www.brevo.com/)

## 🚀 Installation & Lancement Local

Si vous souhaitez explorer le code et lancer le projet localement :

1. **Cloner le dépôt**
   ```bash
   git clone <votre-repo-url>
   cd Shop
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine et renseignez vos clés d'API (Base de données PostgreSQL, NextAuth Secret, clé d'API Brevo, etc.).

4. **Initialiser la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optionnel : peupler la base avec des données de test
   npm run prisma:seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour découvrir le projet.

---

*Développé avec passion pour illustrer la création d'une expérience web contemporaine.*
