# OrientCompanion — Refonte Frontend & Guide Visuel

OrientCompanion est la plateforme d'orientation post-baccalauréat et de préparation aux concours d'excellence au Maroc.
Ce document détaille l'architecture visuelle mise à niveau vers l'identité **« Calm, Premium & Organic Lavender »**, les instructions de remplacement des assets 3D, ainsi que les prompts d'invite Midjourney v6 prêts à l'emploi.

---

## 1. Principes de Design & Identité Visuelle

L'interface adopte une direction artistique inspirée des écosystèmes design contemporains haut de gamme :
- **Atmosphère :** Calme, organique, spacieuse et lumineuse.
- **Arrière-plan :** Neutre très doux `#F5F5F7` (jamais de blanc pur en fond d'écran). Les cartes blanches (`#FFFFFF`) se détachent délicatement dessus avec une bordure fine `#E3E2EC`.
- **Palette :**
  - **Encre sombre (Navy-Violet) :** `#2A2545` (boutons primaires, cartes contrastées, typographie principale `#1E1B33`).
  - **Dégradé lavande signature :** de `#E4E3F5` à `#C9C7EE` et `#A9A7E0`.
  - **Accents violets profonds :** `#6B5BD2` et `#4B3FA8`.
  - **Texte estompé :** `#6B6880`.
  - **Tons d'état :** Succès `#4C9A7A`, Avertissement `#D9A441`, Danger/Erreur `#C75D6B`.
- **Formes & Rayons :**
  - Cartes héros & bannières de page : `rounded-[28px]`.
  - Cartes de contenu : `rounded-3xl` (`24px`).
  - Boutons, pilules & badges : `rounded-full`.
  - Champs de formulaire & sélecteurs : `rounded-xl`.
- **Typographie :** *Plus Jakarta Sans* (graisses 300 à 600). Titres amples avec un crénage serré (`tracking-tight`), poids légers ou réguliers (400), pour préserver une sérénité visuelle.

---

## 2. Dictionnaire des Visuels & Emplacement

Tous les visuels sont centralisés dans le répertoire :
```
src/assets/visuals/
```
Le fichier source unique `src/lib/visuals.js` indexe et exporte l'ensemble des métadonnées (chemins, textes alternatifs `alt`, dimensions intrinsèques).
Le composant `<VisualImage visual={...} />` (dans `src/components/design/VisualImage.jsx`) intègre un repli gracieux (*graceful fallback*) en dégradé lavande avec icône Lucide au cas où une ressource ne chargerait pas ou serait absente.

---

## 3. Prompts Midjourney v6 prêts à copier-coller

Pour générer des rendus photoréalistes / 3D parfaits dans la continuité du style de référence, utilisez les prompts suivants avec **Midjourney v6.0** (ou DALL-E 3) :

### 1. `hero-field.webp` (Bannière Hero & Fond panoramique)
```text
cinematic wide angle shot of a macro field of tiny lavender purple flowers, soft morning mist, floating pearl spheres and translucent lavender frosted glass geometric shapes half buried among the flowers, ethereal soft sunlight, dreamy depth of field, pastel lavender, periwinkle and soft violet palette, hyper-realistic 3D render, octane render, clean, minimal, 8k resolution, serene atmosphere --ar 16:6 --style raw --v 6.0
```

### 2. `obj-cap.webp` (Toque académique / Diplômes)
```text
3D isolated icon of an academic graduation mortarboard cap made of translucent pearl and frosted lavender glass, soft purple tassel, floating weightlessly against an ultra clean light studio background (#F5F5F7), smooth soft subsurface scattering, subtle iridescent reflections, minimal modern design, 8k render, octane render --ar 1:1 --style raw --v 6.0
```

### 3. `obj-compass.webp` (Boussole d'orientation)
```text
3D isolated icon of an elegant orientation compass, crafted in frosted lavender glass and smooth pearl ceramic, delicate lilac directional needle, floating in mid-air with gentle ambient occlusion, soft studio lighting on clean neutral grey background (#F5F5F7), premium tactile design, raytraced 8k --ar 1:1 --style raw --v 6.0
```

### 4. `obj-book.webp` (Livre académique & Filières)
```text
3D isolated icon of a gentle open hardcover study book with curved soft pages, sculpted from pearlescent lavender porcelain and translucent glass, delicate pastel purple bookmarks, hovering against a soft off-white background (#F5F5F7), clean minimal aesthetics, octane render, soft shadows --ar 1:1 --style raw --v 6.0
```

### 5. `obj-hourglass.webp` (Sablier / Gestion du temps concours)
```text
3D isolated icon of a minimalist modern hourglass made of smooth translucent frosted violet glass and polished lavender pearl stands, with fine purple glowing sand trickling down, floating against clean neutral light background (#F5F5F7), soft volumetric lighting, clean 3D render --ar 1:1 --style raw --v 6.0
```

### 6. `obj-trophy.webp` (Trophée d'excellence / Concours)
```text
3D isolated icon of an elegant modern trophy cup with smooth organic handles, made of pearlescent lavender ceramic with subtle iridescent glass highlights, floating centered against a light neutral background (#F5F5F7), soft studio lighting, minimal luxury, octane render 8k --ar 1:1 --style raw --v 6.0
```

### 7. `flower-sprout.webp` (Pousse / Mentorat & Croissance)
```text
3D isolated botanical icon of a delicate minimalist flower sprout blooming with soft purple lavender petals, stem in soft sage green glass, standing delicately with tiny morning dew drops, clean light studio background (#F5F5F7), soft lighting, peaceful organic feel, 3D render --ar 1:1 --style raw --v 6.0
```

### 8. `building-columns.webp` (Grandes Écoles & Universités)
```text
3D architectural icon of classical university entrance columns and pediment, stylized in matte lavender plaster and frosted glass, clean geometric lines, floating angled view against a clean neutral background (#F5F5F7), soft diffused shadows, minimal academic prestige, octane render --ar 1:1 --style raw --v 6.0
```

### 9. `bg-soft-blob.webp` (Fond d'ambiance flou)
```text
abstract background gradient texture, ultra soft organic liquid glass shapes blending pastel lavender (#E4E3F5), muted lilac (#C9C7EE) and delicate warm ivory, extreme gaussian blur, clean ethereal backdrop, subtle grain, premium smooth lighting --ar 16:9 --v 6.0
```

### 10. `empty-state.webp` (Illustration état vide / Recherche)
```text
3D isolated composition of a frosted lavender floating magnifying sphere resting gracefully on a bed of tiny violet flower petals, soft morning light, gentle reflections, light neutral background (#F5F5F7), calm and inviting empty state illustration, minimal 3D render --ar 1:1 --style raw --v 6.0
```

---

## 4. Comment remplacer ou mettre à jour les visuels

1. **Génération & Export :**
   - Téléchargez les images générées depuis votre outil d'IA (Midjourney, DALL-E, etc.).
   - Supprimez le fond si nécessaire (pour les icônes d'objets `obj-*.webp`) afin d'obtenir un fond transparent ou un fond s'intégrant au ton `#F5F5F7`.

2. **Conversion en WebP :**
   Convertissez les fichiers en format `.webp` compressé avec `cwebp` ou un outil en ligne :
   ```bash
   cwebp -q 85 input.png -o obj-cap.webp
   ```

3. **Remplacement direct :**
   Déposez simplement vos nouveaux fichiers dans :
   ```
   src/assets/visuals/
   ```
   En conservant les noms de fichiers suivants :
   - `hero-field.webp`
   - `obj-cap.webp`
   - `obj-compass.webp`
   - `obj-book.webp`
   - `obj-hourglass.webp`
   - `obj-trophy.webp`
   - `flower-sprout.webp`
   - `building-columns.webp`
   - `bg-soft-blob.webp`
   - `empty-state.webp`

4. **Aucune modification de code requise :**
   Vite rechargera automatiquement les visuels grâce aux imports statiques de `src/lib/visuals.js`.

---

## 5. Prise en compte de l'accessibilité (`prefers-reduced-motion`)

Tous les composants d'animation (`Float`, `Sway`, `Reveal`, `Parallax`, `CountUp`) intègrent la détection automatique de la préférence utilisateur `prefers-reduced-motion: reduce`.
En cas d'activation, les animations continues et transitions dynamiques sont désactivées pour garantir un confort visuel optimal et une accessibilité conforme aux standards WCAG.
