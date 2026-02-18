# Déploiement sur cPanel (PHP Only)

## Prérequis

- Hébergement cPanel avec PHP 7.4+ et MySQL
- Accès au gestionnaire de fichiers ou FTP
- Base de données MySQL créée

---

## Étape 1 : Construire le frontend

```bash
npm run build
```

Cela génère un dossier `out/` contenant tous les fichiers statiques.

---

## Étape 2 : Préparer la base de données

1. Dans cPanel, ouvrez **phpMyAdmin**
2. Créez une base de données (ex: `sav_gestion`)
3. Importez le fichier `api/database.sql`
4. Puis importez `api/migrate_categories.sql`
5. (Optionnel) Importez `api/seed.sql` pour des données de test

---

## Étape 3 : Configurer le backend PHP

Éditez `api/config.php` avec vos identifiants cPanel MySQL :

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'votre_cpanel_user_sav_gestion');  // préfixé par votre user
define('DB_USER', 'votre_cpanel_user_dbuser');
define('DB_PASS', 'votre_mot_de_passe');
define('DB_CHARSET', 'utf8mb4');
define('ALLOWED_ORIGIN', 'https://votre-domaine.com');  // votre domaine
```

---

## Étape 4 : Upload des fichiers

### Structure dans `public_html/` :

```
public_html/
├── api/                    ← Tout le dossier api/
│   ├── config.php
│   ├── Database.php
│   ├── helpers.php
│   ├── tickets.php
│   ├── archives.php
│   ├── stats.php
│   ├── status.php
│   ├── login.php
│   ├── suggestions.php
│   ├── demande.php
│   └── ...
├── _next/                  ← Depuis out/_next/
├── track/                  ← Depuis out/track/
├── tickets/                ← Depuis out/tickets/
├── login/                  ← Depuis out/login/
├── dashboard/              ← Depuis out/dashboard/
├── user/                   ← Depuis out/user/
├── entreprise/             ← Depuis out/entreprise/
├── new-ticket/             ← Depuis out/new-ticket/
├── technician/             ← Depuis out/technician/
├── archives/               ← Depuis out/archives/
├── index.html              ← Depuis out/index.html
├── 404.html                ← Depuis out/404.html
├── logo.jpg                ← Depuis out/logo.jpg
├── icon.svg                ← Depuis out/icon.svg
├── .htaccess               ← Depuis out/.htaccess (IMPORTANT!)
└── ...
```

### Instructions :

1. Uploadez **tout le contenu** du dossier `out/` dans `public_html/`
2. Uploadez le dossier `api/` dans `public_html/api/`
3. Vérifiez que `.htaccess` est présent dans `public_html/`

---

## Étape 5 : Configurer l'URL de l'API

Créez un fichier `.env.local` n'est pas nécessaire en production car l'API est
sur le même domaine. L'URL est déjà relative dans le code.

**Important** : Mettez à jour `ALLOWED_ORIGIN` dans `api/config.php` avec votre domaine.

Aussi, mettez à jour `NEXT_PUBLIC_API_URL` dans le code source avant le build si nécessaire :

Dans `src/lib/api.js`, la variable `API_BASE` utilise par défaut `http://localhost:8000`.
Pour la production, changez-la ou créez un `.env.production` :

```
NEXT_PUBLIC_API_URL=https://votre-domaine.com/api
```

Puis relancez `npm run build`.

---

## Étape 6 : Vérifications

1. Visitez `https://votre-domaine.com/` → Page d'accueil avec 3 options
2. Testez `https://votre-domaine.com/api/stats.php` → Doit retourner du JSON
3. Testez la connexion technicien (admin / admin123)
4. Créez un ticket et vérifiez le suivi

---

## Configuration email (pour l'espace Entreprise)

Les emails sont envoyés via la fonction PHP `mail()`.
Sur cPanel, cette fonction est généralement activée par défaut.

Les destinataires configurés :

- **Demande d'achat** → `commercial@it-smv.com`
- **Demande de prestation** → `technique@it-smv.com`

Pour modifier, éditez `api/demande.php`.

---

## Notes importantes

- **Mots de passe** : Changez les identifiants dans `api/login.php` en production !
- **CORS** : Mettez à jour `ALLOWED_ORIGIN` dans `api/config.php`
- **HTTPS** : Décommentez les lignes HTTPS dans `.htaccess`
- **PHP mail()** : Si les emails ne fonctionnent pas, configurez SMTP dans cPanel
