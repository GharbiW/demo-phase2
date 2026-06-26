---
title: Handover Parnass — Phase 2 (Cockpit économique du transport)
client: Groupe PARNASS
agence: Ailéane
auteur: Yann Cuisinier (y.cuisinier@aileane.com)
destinataire: Claude Team — prise en main du dossier
date_redaction: 2026-05-19
statut_phase: Discovery terminée, restitution livrée le 11/05/2026, entrée en cadrage build
version_doc: 1.0
---

# Handover Parnass — Phase 2

> **À toi qui reprends ce dossier (Claude Team ou nouvel agent).** Ce document est une passation auto-portée : il te donne le contexte client, la grille de lecture produit, l'état d'avancement, les décisions actées, les questions encore ouvertes, les fichiers où chercher la vérité, et les prochaines étapes attendues. Lis-le linéairement — il est conçu pour qu'à la fin tu puisses prendre la parole en réunion projet sans avoir besoin d'interroger Yann en amont.

---

## 1. Résumé exécutif (à lire en 2 minutes)

**Le client.** Groupe PARNASS — transporteur routier multi-sociétés (PARNASS Transports, Solid, et apparentés). Activité : tournées et courses pour comptes grands donneurs d'ordre (DHL Express, CDiscount, Engie, Auchan, Chronopost, Colissimo, etc.). Flotte mixte (tracteurs VL / SPL / Porteurs Gasoil + GNV) avec sous-traitance significative.

**Le mandat Ailéane.** Deux phases distinctes mais imbriquées :
- **Phase 1 (en cours)** — Plateforme Parnass (anciennement « Parnass 360 »), TMS d'exploitation maison. Couvre conception/affectation des tournées, remplacements, gestion conducteur+véhicule. **Pivot architectural majeur le 13/05/2026** : abandon de la « tournée centrale partout » au profit d'une architecture 3 couches (Conception / Exploitation / Réel). Voir mémoire `project_parnass_module_conception`.
- **Phase 2 (objet de ce handover)** — Module **SaaS Rentabilité d'Exploitation** : transformer la Plateforme Parnass en *cockpit économique du transport*. Discovery terminée, restitution livrée 11/05/2026.

**État Phase 2 au 19/05/2026.**
- Contrat Phase 2 signé (cf. `Contrat Parnass Phase 2 signé.pdf`).
- 4 ateliers Discovery tenus les 13–15/04/2026.
- Conventions chiffrées et grille à **13 postes de coût** consolidées (peut évoluer à 15-16 selon arbitrage Q1–Q4).
- Document Excel pivot : `Discovery Renta d'Exploitation (1).xlsx` (16 onglets) — référence chiffrée maître.
- Restitution Discovery livrée au client le **11/05/2026** (déplacée depuis le 05/05 par décision Yann le 07/05).
- Pivot Phase 1 du 13/05 débloque mécaniquement Phase 2 par construction de la couche « Réel ».

**Prochaine étape majeure attendue.** Cadrage des arbitrages Q1–Q4 (structure de la grille de coûts), puis entrée en spec build du Cost Engine et du Data Cost Hub. Calendrier Phase 1 prévoit production sur 2-3 prestations début juin — ce sera le premier jeu de données « réel » exploitable par Phase 2.

---

## 2. Contexte client (qui est PARNASS, pourquoi on intervient)

### 2.1 L'activité

PARNASS est un transporteur routier dont l'activité se découpe en deux logiques :
- **Tournées** récurrentes pour grands donneurs d'ordre (rotations planifiées sur contrats de longue durée).
- **Courses spot / SUP** (Suppléments) facturées au coup par coup, souvent en mode dégradé (tarification à négocier vite, marge à estimer en flux).

La flotte comporte des typologies moteur distinctes qui structurent toute l'analyse de coût aval :
- **TRAGO** (tracteur Gasoil) — réf. 28 L/100 km
- **TRAGZ** (tracteur GNV / Gaz) — réf. 30,5 kg/100 km
- **PORGO** (porteur Gasoil) — réf. 30 L/100 km
- **PORGZ** (porteur GNV / Gaz) — réf. 33 kg/100 km

Ces consommations de référence incluent les km à vide (point important pour la conception du Cost Engine — pas de double-comptage avec les retours haut-le-pied).

### 2.2 Le SI existant et ses dettes

Le SI Parnass est éclaté entre plusieurs outils :
- **WinCPL** — gestion de parc historique, fiabilité hétérogène, à reprendre proprement.
- **MyRentCar** — loyers véhicules (responsable côté Parnass : Raphael).
- **Solide / Silae** — temps de travail (tachygraphe) + paie réelle (Mathieu interlocuteur API).
- **Masternaut** — télématique / kilométrage.
- **Michelin** — télématique carburant complément.
- **AS24** — stations / carburant.

Pain points connus :
- ~**600 k€ de coûts de non-utilisation véhicules** sur l'année passée — métrique citée en atelier, à re-fiabiliser.
- Synchro Tachy / Solid **irrégulière** (défaut 7 nuits observé).
- Planning **non rétro-alimenté** par l'exploitation → décorrélation conception / réalité.
- Ventilation entre sociétés du groupe **floue** (factures garage notamment).
- Pas d'outil de gestion de parc centralisé fiable.

### 2.3 L'ambition Phase 2

Passer de la *gestion des tournées* à la *maîtrise de la rentabilité*. Concrètement :
- Calculer un coût et un CA **théoriques** (prévus / conception) ET **réels** (réalisés / exploitation), poste par poste.
- Confronter les deux pour **identifier les écarts** (détour, surconsommation, pénalité, casse, dérive salariale).
- Restituer **par tournée**, puis **par client / véhicule / conducteur**, en temps réel.
- Remplacer les analyses Excel mensuelles actuelles (`Renta_Avril_2025 (1).xlsx`) par un cockpit web vivant.

> **Convention de vocabulaire critique** (à respecter dans tout livrable Phase 2) :
> - « **Théorique** » = prévu, conception, contractuel.
> - « **Réel** » = réalisé, exploitation, mesuré.
> - Ne **jamais** mélanger les deux tracks dans la même métrique sans qualifier.

---

## 3. Architecture produit — les 6 modules Phase 2

C'est la **grille de lecture officielle** signée. Toute restitution, spec, présentation client doit s'articuler dessus.

### 3.1 Module 1 — Commercial & Tarification (« le moteur de revenu »)
- **Rôle.** Sécurise la marge **avant** exploitation.
- **Fonctions clés.** Calcul automatique du CA théorique, grilles tarifaires (km / forfait / palette / trinôme), indexation carburant (CNR, Dirham, pondération multi-indices), aide au chiffrage Spot/SUP avec triplet *coût estimé + prix minimum conseillé + niveau de risque*.
- **Référentiel sources.** `Indexation Carburant 2026.xlsx` / `.csv` / `.pdf` dans `Phase 2/Préparation Discovery/`. Cinq indices CNR distincts à expliciter (Gasoil pro / HTVA / Cuve moy mensuelle / GNV / fioul) + cas TIPCE Auchan.
- **Modes de facturation.** Quatre modes recensés : **Forfaitaire / TK / Taux horaire / Trinôme**. Convention « date de chargement fait foi » pour le CA réel.

### 3.2 Module 2 — Data Cost Hub (« la base de vérité des coûts »)
- **Rôle.** Couche d'infrastructure et de consolidation financière.
- **Fonctions clés.** Centralise, normalise, fiabilise les données dispersées de coût.
- **Sources principales.**
  - Carburant : **AS24** + télématique **Michelin**.
  - Kilométrage : **Masternaut**.
  - Temps de travail : tachygraphe **Solide** / **Silae**.
  - Maintenance & parc : **WinCPL**, **MyRentCar**.
- **Enjeu critique.** Qualité / gouvernance données aujourd'hui faible — ce module porte la majorité du risque technique Phase 2.

### 3.3 Module 3 — Cost Engine (« le moteur de calcul des coûts »)
- **Rôle.** Transforme les données brutes du Data Cost Hub en coûts financiers ventilés.
- **Calcule** coût **théorique** ET coût **réel** par tournée, ventilé sur la grille à 13 postes (voir §5).
- **Convention de calcul carburant.** litres × prix réel (et non litres théoriques × prix indexé) sur le track réel.
- **Convention salariale.** forfait (théorique) OU heures réelles (track réel) — distinction stricte.
- **Matériels.** ventilation loyer / amortissement / entretien, distinguer tracteurs et remorques.

### 3.4 Module 4 — Profitability Engine (« le moteur d'analyse financière »)
- **Rôle.** Cœur stratégique du SaaS.
- **Fonction clé.** Confronte les **revenus** (Module 1) aux **coûts** (Module 3) au niveau le plus fin = **la tournée**. Calcule la marge brute par tournée / prestation / client.
- **Analyse des écarts théorique vs réel** : kilométrique, carburant, salarial, péages, sous-traitance.
- **Sortie attendue.** Identification automatique des causes de perte de marge (détour, surconsommation, pénalité retard, casse, sous-traitance déficitaire).

### 3.5 Module 5 — Dashboard Rentabilité (« le cockpit de pilotage »)
- **Rôle.** Interface visuelle et décisionnelle.
- **Vues.**
  - Synthétiques : P&L par tournée, marge globale, taux rentabilité.
  - Exploration interactive : filtres période / client / site / véhicule.
  - Alertes opérationnelles : tournée déficitaire, dépassement km anormal, etc.
- **Cible.** Remplacement des analyses Excel mensuelles (`Renta_Avril_2025 (1).xlsx`) par du temps réel.

### 3.6 Module 6 — Decision Support & Optimisation (« l'assistant stratégique »)
- **Rôle.** Passe du constat à l'action.
- **Fonctions clés.**
  - Détection automatique d'anomalies.
  - Leviers d'amélioration : optimisation itinéraires, suggestion changement typologie véhicule, recommandation station AS24 pertinente (proximité × prix indexé).
  - Simulation de scénarios économiques **avant** validation d'un choix d'exploitation ou tarification.

### 3.7 Dépendances entre modules

```
Module 1 (CA théorique) ──┐
                          ├──► Module 4 (Profitability) ──► Module 5 (Dashboard) ──► Module 6 (Decision Support)
Module 2 (Data Hub) ──► Module 3 (Cost Engine) ──┘
```

Le **chemin critique** technique est : Data Cost Hub (Module 2) → Cost Engine (Module 3). Sans Module 2 propre, le reste s'effondre. Tout retard de fiabilisation des sources amont (WinCPL, Silae, Masternaut, MyRentCar) impacte directement le go-live.

---

## 4. Phase 2 et son lien avec Phase 1 (le pivot du 13/05/2026)

Phase 2 dépend de la couche « Réel » qui sera produite par la Plateforme Parnass (Phase 1).

### 4.1 Le pivot architectural du 13/05/2026

Décision actée le 13/05 : abandon du modèle « tournée centrale partout ». Architecture cible en **3 couches** :

| Couche | Couleur convention | Contenu | Sert qui |
|---|---|---|---|
| **Conception** | Jaune | Templates, planning prévisionnel, affectations permanentes. Garde la logique tournée. | Théorique Phase 2 |
| **Exploitation** | Verte | Table séparée. Modifications live conducteur/véhicule/course. Pas de concept de tournée exposé à l'utilisateur. | Travail BO quotidien |
| **Réel** | (historisée, append-only) | Écrite à la **fin de chaque trajet**. Base reporting + module finance Phase 2. | **Phase 2 directement** |

**Pourquoi ce pivot.** Demande Matthieu (12/05) — démarrer petit, focus chauffeur+véhicule, moins de règles. Plus simple, livrable, **débloque Phase 2 Rentabilité par construction**. Remplace définitivement le plan « Solution B refonte 12-18 mois » de Firas.

**Calendrier Phase 1 communiqué.**
- 17/05 : livraison conception Firas
- 18-22/05 : base exploitation
- 25-31/05 : QA (estimée 3-10 j — large fourchette, risque actif)
- 01-07/06 : prod sur 2-3 prestations pilotes
- 08/06+ : extension

**Conséquence pour Phase 2.** La couche « Réel » (3ᵉ couche) est **la source amont** du Module 3 (Cost Engine) et du Module 4 (Profitability Engine). Tout retard Phase 1 décale la mise en production Phase 2.

**Note critique.** Vérifier l'état réel de la livraison Phase 1 (postérieur au 13/05) avant toute communication client sur le planning Phase 2. Les memories sur ce point datent du 13/05 — relire les CR Pilotage Stratégique et les retours Firas / Raphaela avant de prendre la parole.

### 4.2 Décisions Phase 1 qui impactent Phase 2 (8 sujets ouverts au 04/05)

Liste à connaître (issus de `Restitution_Raphaela_Module_Conception.docx`) :

1. Changement véhicule/conducteur — modification en place vs tournée dérivée (CM03 → CM03-bis) vs historisation par override. **Conditionne directement le futur Profitability Engine.**
2. Source de vérité affectations — aligner les 3 écrans (Organisation / À placer / Planning).
3. Modèle weekend — tournée dédiée (CM03-weekend) avec conducteurs A/B pair/impair, ou alternance. Bloque CM17.
4. Affectation permanente sans tournée — règle actuelle force la liaison à une tournée.
5. **Historisation des affectations** — prérequis Phase 2.
6. Conflits multi-dates — option A retenue (affichage agrégé) à valider.
7. Droits N3 — 16 règles dérogables par tous, à restreindre aux superviseurs.
8. Restitution client — format en deux temps (HTML d'abord, démo jeudi).

---

## 5. Discovery Rentabilité — détail des ateliers et de la grille de coûts

### 5.1 Les 4 ateliers Discovery (13–15/04/2026)

Tenus sur 3 jours consécutifs, ils ont permis de figer :
- Les **3 unités d'analyse** : Conducteur · Véhicule · Tournée (socle final, descend au trajet quand pertinent).
- Les **3 référentiels maîtres** :
  - **Conducteurs** — matricule + profil (VL / CM / SPL / Polyvalent) + taux journalier.
  - **Véhicules** — immatriculation + catégorie + énergie + équipements + casse + assurance.
  - **Énergies** — code + unité + table d'indexation.
- L'**hypothèse H1** : diviseur jours ouvrés = **21 jours**.
- La **grille à 13 postes** (cf. §5.3 ci-dessous).

Documents source à consulter en priorité :
- `Phase 2/Préparation Discovery/Discovery.docx` — doc cadre Discovery
- `Phase 2/Préparation Discovery/Cadrage_V1_Rentabilite_Exploitation.docx` — cadrage V1
- `Phase 2/Préparation Discovery/Discovery Renta d'Exploitation (1).xlsx` — **fichier pivot 16 onglets, vérité chiffrée**
- `Phase 2/Préparation Discovery/Indexation Carburant 2026.xlsx` (+ pdf + csv)
- `Phase 2/Préparation Discovery/BI_Sous-traitance (1).pdf`
- `Phase 2/Préparation Discovery/Renta_Avril_2025 (1).xlsx` — exemple de l'analyse Excel actuelle à remplacer

### 5.2 Restitution Discovery — 11/05/2026 (décalée du 05/05)

Décision Yann le 07/05/2026 : restitution déplacée du 5 mai au 11 mai 2026.
- Fichier de travail principal : `Phase 2/Restitution/Restitution_Discovery_Phase2_05-05-2026.html` (renommé en interne « 11-05-2026 » dans la mémoire — vérifier si le rename de fichier a effectivement été fait ou s'il reste en `_05-05-2026.html`).
- Pages connexes dans le même dossier :
  - `Restitution_Atelier_1.html`
  - `Restitution_Atelier_2_3.html`
  - `Restitution_Atelier_4.html`
  - `Restitution_Architecture_Data.html`
  - `Restitution_Modele_Economique.html`
  - `Restitution_Scope.html`
- Renames globaux appliqués au HTML :
  - « Parnass 360 » → « **Plateforme Parnass** »
  - « Solides » → « **Solid** »

### 5.3 La grille à 13 postes de coût

Liste des 13 postes (référence onglets Excel Discovery) avec conventions chiffrées issues des ateliers :

| # | Poste | Convention chiffrée / règle clé | Responsable |
|---|---|---|---|
| 01 | Loyer tracteur | Harmoniser formule **Valeur ÷ 21** (cohérence H1) — non encore intégré HTML | Raphael (loyers MyRentCar) |
| 02 | Loyer remorque | Règle « débord client 100% vs partage » + **1 semi par type vs CdC** — à intégrer | Raphael |
| 03 | Carburant tracteur | Conso réf. par typo moteur : **TRAGO 28 L/100km · TRAGZ 30,5 kg/100km · PORGO 30 L/100km · PORGZ 33 kg/100km**. Inclut km à vide. | Laurent (indexation) |
| 04 | Carburant frigo | Conso réf. **2 L/h** · carburant officiel **GNR (Gaz Non Routier)** | — |
| 05 | AdBlue | Restriction « tracteurs Gasoil uniquement » · prix réf. **0,42 €/L** · conso **1,9 L/100km** | — |
| 06 | Salaires | Taux journaliers atelier : **SPL 210 € · CM 235 € · Polyvalent 305 €** · amplitude réf. **12 h**. **VL non donné par atelier — point ouvert (Mathieu)**. | Mathieu (paie réelle Silae) |
| 07 | Primes | À potentiellement fusionner avec 06 — voir Q4 | Mathieu |
| 08 | Péages | Convention « **imputer le péage à la bonne presta/course** » — à intégrer HTML | Exploitation |
| 09 | Entretien & pièces | Voir Q1 : intégrer Géoloc ou pas ? | — |
| 10 | Géoloc | Ligne autonome OU intégré 09 — voir Q1 | — |
| 11 | Assurance | Voir Q3 : inclut APSAD ou pas ? | — |
| 12 | Équipements (tire-palette, chariot, APSAD, hayon, ADR) | Voir Q2 : ligne autonome OU rattaché référentiel Véhicules. Lié à H7. | — |
| 13 | Sous-traitance | Ventilation au **prorata des heures** courses vs tournées | **Housam** |

> ⚠️ La numérotation 09-12 ci-dessus est *indicative* : la grille publiée fige 13 lignes mais l'arbitrage Q1+Q2+Q3 peut faire passer à **15 ou 16 lignes**. À reconfirmer en cellule HTML/Excel finalisée.

### 5.4 Questions de structure ouvertes (Q1–Q4)

À arbitrer (point d'arbitrage initialement prévu le 11/05 lors de la restitution — vérifier où l'on en est) :

- **Q1** — Poste « Géoloc » : ligne autonome ou intégré au poste 09 Entretien & pièces ?
- **Q2** — Poste « Équipements » (tire-palette, chariot, APSAD, hayon, ADR) : ligne autonome ou rattaché au référentiel Véhicules ? Lié à H7.
- **Q3** — Poste « APSAD » : autonome ou inclus dans Assurance (poste 11) ?
- **Q4** — Salaires (06) + Primes (07) : garder la séparation HTML ou aligner sur l'onglet Excel unique « Salaires » ?
- **Conséquence.** Si Q1 + Q2 + Q3 = autonome → grille passe de **13 à 15-16 postes**.

### 5.5 Sujets identifiés à l'audit, pas encore intégrés au HTML (mémoire 07/05)

À traiter dans la prochaine itération du livrable HTML :
- Poste 01 — Harmoniser formule « Valeur ÷ 21 » (cohérence H1).
- Poste 02 — Règle débord client 100% vs partage + 1 semi par type vs CdC.
- Poste 08 — Convention « imputer le péage à la bonne presta/course ».
- Indexation carburant — 5 indices CNR distincts (Gasoil pro / HTVA / Cuve moy mensuelle / GNV / fioul) + cas TIPCE Auchan.
- Section CA — 4 modes de facturation (Forfaitaire / TK / Taux horaire / Trinôme) + convention CA réel + « date de chargement fait foi ».

---

## 6. Risques majeurs Phase 2

Liste classée par criticité, héritée du Discovery et de l'audit interne.

1. **Qualité données amont.** Sources éclatées et qualité hétérogène (factures garage, ventilation inter-sociétés, WinCPL). Risque #1 sur Module 2 (Data Cost Hub). Plan d'atténuation à proposer : fiabilisation progressive par poste, MVP sur sources les plus propres (AS24, Masternaut) avant d'attaquer WinCPL.
2. **Décorrélation conception / exploitation.** Planning non rétro-alimenté. Atténué par le pivot 13/05 (couche Réel append-only) mais dépendant du go-live Phase 1.
3. **~600 k€ de coûts de non-utilisation véhicules / an.** Métrique forte côté ROI à re-fiabiliser. Argument commercial pour Phase 2 mais doit être documenté solidement avant communication.
4. **Synchro Tachy/Solid irrégulière** (défaut 7 nuits). Impact direct sur poste 06 Salaires réel.
5. **Absence d'outil de gestion de parc centralisé.** WinCPL à fiabiliser. Pourrait nécessiter un projet préalable hors scope Phase 2.
6. **Dépendance Phase 1 — pivot 13/05.** Si la couche « Réel » Phase 1 ne sort pas en juin, Phase 2 ne peut pas démarrer les modules 3 et 4. À monitorer hebdo.
7. **Gouvernance des droits.** Lecture des rentabilités complètes restreinte à **Mathieu et Zoubir** (décision atelier 4). Yasmine + Alexandre en charge de la modélisation finale des droits. Risque RH / politique interne si ouverture mal calibrée.

---

## 7. Parties prenantes et responsabilités

### 7.1 Côté Parnass

| Personne | Rôle / responsabilité Phase 2 |
|---|---|
| **Zoubir** | Sponsor exécutif. Lecture des rentabilités complètes (avec Mathieu). |
| **Mathieu** | Référent paie réelle (Silae). Interlocuteur API. Valeurs taux journaliers. Lecteur des rentabilités complètes. **Demandeur du pivot 12/05.** |
| **Laurent** | CA théorique / contrats / règles tarifaires. Indexation carburant. **Responsable de la majorité des onglets Discovery Excel.** |
| **Housam** | Sous-traitance (poste 13). |
| **Raphael** | Loyers véhicules (MyRentCar). |
| **Exploitation** | CA réalisé, validation prestas effectuées, imputation péages à la bonne course. |
| **Yasmine + Alexandre** | Modélisation finale des droits d'accès aux rentabilités réelles. |

### 7.2 Côté Ailéane

| Personne | Rôle |
|---|---|
| **Yann Cuisinier** | Direction de projet, interlocuteur principal client. |
| **Raphaela** | Chef de projet (en charge du Module Conception Phase 1). Pivot architectural 13/05. |
| **Firas** | Architecte / dev référent. Livre la conception au 17/05 (à vérifier). Renfort Georges/Aymen évoqué. |
| **Wael, Georges, Aymen** | Équipe build Phase 1. |

### 7.3 Cadence de pilotage

- **Pilotage stratégique** — réunion régulière (dernière trace `Compte rendu Pilotage Stratégique/Parnass Pilotage Strat wk 19_01_2026.pptx`). Vérifier les CR plus récents.
- **Reporting projet** — `Reporting direction de projet (NSA)/01-AILEANE x Gpe PARNASS-Deck reporting projet.pptx`.
- **Weekly** — `Weekly reporting/Parnass Pilotage Strat wk 19 01 2026.gslides`.

---

## 8. Cartographie des livrables et fichiers de référence

### 8.1 Dossier `Phase 2/` — structure actuelle

```
Phase 2/
├── Champs_Module_Commercial.xlsx                ← spec champs Module 1 (Commercial & Tarification)
├── Préparation Discovery/
│   ├── Discovery.docx                            ← doc cadre Discovery
│   ├── Cadrage_V1_Rentabilite_Exploitation.docx
│   ├── Contrat Parnass Phase 2 signé.pdf         ← contrat
│   ├── Discovery Renta d'Exploitation (1).xlsx   ← **PIVOT 16 onglets**
│   ├── Indexation Carburant 2026.xlsx / .csv / .pdf
│   ├── BI_Sous-traitance (1).pdf
│   ├── Renta_Avril_2025 (1).xlsx                 ← état actuel à remplacer
│   ├── 2026-04-13 17.29.51.pdf                   ← capture atelier
│   ├── architecture.png                          ← visuel archi cible
│   ├── infographie.png                           ← visuel pédagogique
│   └── Module_Commercial/
└── Restitution/
    ├── Restitution_Discovery_Phase2_05-05-2026.html  ← support 11/05 (nom à vérifier)
    ├── Restitution_Atelier_1.html
    ├── Restitution_Atelier_2_3.html
    ├── Restitution_Atelier_4.html
    ├── Restitution_Architecture_Data.html
    ├── Restitution_Modele_Economique.html
    └── Restitution_Scope.html
```

### 8.2 Documents externes au dossier `Phase 2/` mais essentiels

- `Devis/Phase 2/` (à vérifier la présence du devis Phase 2 signé — uniquement Phase 1 listée dans la glob).
- `SI Existant/Stratégie API Parnass.pptx` — référence intégration.
- `SI Existant/MCF Tacho BVFM APIs Document (1.00) 20 sept 2024.pdf` + `MCF_Connect_API_Reference_v1.35_20 sept 2024.pdf` — API tachygraphe (poste 06 réel).
- `SI Existant/Liste Applicatifs utilisés par PARNASS Group.gdoc` — cartographie SI client.
- `SI Existant/PTMS_MCD.png`, `DB/PTMS_MCD_v0.5.png`, `DB/PTMS_MLD_v0.5.png`, `DB/PTMS_v0.5.sql` — MCD/MLD/SQL de la base PTMS (Plateforme Parnass).
- `Ateliers/Transcripte regle metier.docx`, `Transcription Atelier 4 - Activité 2.docx`, `Structure du temps.docx`, `Règles pour le choix du tracteur.docx`, `Règles pour le choix du chauffeur.docx` — règles métier transverses.
- `Règle/📘 RÈGLES MÉTIER Véhicules.docx`.
- `TECH/NOTES.gdoc` et `TECH/DRAFT TECHNIQUE.gdoc`.
- `Note_Cadrage_Matthieu_13mai.docx` (à la racine PARNASS) — pivot 3 couches du 13/05.

### 8.3 Memories Claude pertinentes

Trois mémoires indexées dans `MEMORY.md` directement pertinentes :

- `project_parnass_phase2.md` — Discovery, grille 13 postes, conventions chiffrées (mise à jour 07/05/2026).
- `project_parnass_phase2_6_modules.md` — architecture produit 6 modules (référence officielle).
- `project_parnass_module_conception.md` — pivot 3 couches 13/05, lien Phase 1 → Phase 2.

> ⚠️ Ces mémoires sont des **observations à un instant T**. Toujours vérifier la fraîcheur (le système marque l'âge en jours) et confronter au fichier sur disque avant d'asserter en réunion.

---

## 9. Décisions structurantes actées (récapitulatif)

À ne pas remettre en question sauf signal explicite client :

1. **Deux tracks** : théorique vs réel — distinguer systématiquement.
2. **3 unités d'analyse** : Conducteur · Véhicule · Tournée (descente au trajet possible).
3. **3 référentiels maîtres** : Conducteurs · Véhicules · Énergies.
4. **H1 = 21 jours ouvrés** (diviseur).
5. **Grille à 13 postes** (peut passer à 15-16 selon Q1-Q4).
6. **Lecture rentabilités complètes** : Mathieu et Zoubir uniquement (décision atelier 4).
7. **Vocabulaire** : « Plateforme Parnass » (et non « Parnass 360 »), « Solid » (et non « Solides »).
8. **Restitution Discovery** : 11/05/2026.
9. **Pivot Phase 1** (13/05) : architecture 3 couches Conception / Exploitation / Réel. La couche Réel = source amont Phase 2.

---

## 10. Plan d'attaque post-restitution (proposé, à valider)

À l'instant T (19/05/2026), voici l'ordonnancement logique des prochaines étapes Phase 2. **À reconfirmer** avec Yann et avec les retours du 11/05.

### Sprint 0 — Cadrage build (S20-S22 / mai-début juin)
- Trancher **Q1-Q2-Q3-Q4** sur la grille de coûts (lock à 13, 15 ou 16 postes).
- Confirmer la valeur taux journalier **VL** (point ouvert Mathieu, poste 06).
- Intégrer au HTML les 5 sujets §5.5 non encore traités.
- Finaliser la spec **Module 2 (Data Cost Hub)** — c'est le chemin critique.
- Spec **Module 1 (Commercial & Tarification)** — `Champs_Module_Commercial.xlsx` est l'amorce, à compléter.

### Sprint 1 — MVP Data + Cost (S23-S26 / juin)
- Connecteurs prioritaires : **AS24** (carburant), **Masternaut** (km), **Solide/Silae** (paie/temps).
- Cost Engine sur 5 postes les plus stables : 03 Carburant tracteur, 04 Carburant frigo, 05 AdBlue, 06 Salaires (forfait), 13 Sous-traitance.
- **Premier jeu de données réel** = les 2-3 prestations pilotes Phase 1 (prod 01-07/06).

### Sprint 2 — Profitability + Dashboard MVP (S27-S30 / juillet)
- Module 4 confrontation théorique/réel sur les 5 postes du Sprint 1.
- Module 5 dashboard : P&L par tournée + filtres élémentaires + 1-2 alertes.
- Démo client en interne avant ouverture aux utilisateurs métiers.

### Sprint 3+ — Extension grille + Decision Support
- Compléter Cost Engine sur 8 postes restants.
- Indexation carburant complète (5 indices CNR).
- Module 6 Decision Support — d'abord détection anomalies, puis simulation.

> 📌 **Note**. Ce plan est un fil rouge pour la passation. Il n'a **pas encore été validé** formellement par le client au moment de la rédaction de ce handover. Tout commit calendrier doit passer par Yann.

---

## 11. Comment prendre en main rapidement (checklist Claude Team)

Si tu es l'instance qui reprend, voici l'ordre conseillé en moins de 2 h de lecture :

1. **Lire les 3 mémoires** : `project_parnass_phase2_6_modules.md`, `project_parnass_phase2.md`, `project_parnass_module_conception.md`. Elles te donnent 90 % du contexte décisionnel.
2. **Ouvrir l'Excel Discovery** : `Phase 2/Préparation Discovery/Discovery Renta d'Exploitation (1).xlsx` — c'est la vérité chiffrée. 16 onglets, parcourir au moins les onglets postes 03, 04, 05, 06, 13.
3. **Ouvrir le HTML de restitution** : `Phase 2/Restitution/Restitution_Discovery_Phase2_05-05-2026.html`. C'est l'état du discours client au 11/05.
4. **Lire le contrat** : `Phase 2/Préparation Discovery/Contrat Parnass Phase 2 signé.pdf` — pour ne pas dériver hors scope contractuel.
5. **Survoler** : `architecture.png`, `infographie.png` (Préparation Discovery), pour visualiser la cible.
6. **Vérifier l'état Phase 1** côté pivot 13/05 : `Note_Cadrage_Matthieu_13mai.docx` à la racine PARNASS + tout CR Pilotage Stratégique postérieur. Sans cela, tu ne peux pas calibrer le planning Phase 2.
7. **Avant toute parole en réunion**, confronter ce que disent les memories aux fichiers actuels — elles peuvent être périmées (la mémoire 07/05 a 12 jours au moment de la rédaction).

### À ne **jamais** faire sans validation Yann

- Communiquer un planning Phase 2 ferme au client.
- Trancher Q1-Q4 (structure de la grille).
- Ouvrir la lecture des rentabilités au-delà de Mathieu + Zoubir.
- Renommer un poste de coût (le vocabulaire est conventionnel et engageant).
- Toucher au contenu commercial / contractuel.

### À faire spontanément si on te le demande

- Mettre à jour un poste de la grille avec une convention chiffrée nouvelle issue d'un atelier.
- Produire une variante de la restitution adressée à un sous-public (exploit / direction / finance).
- Drafter un mémo technique pour un connecteur (AS24, Masternaut, Silae).
- Préparer une note de cadrage pour un module spécifique.

---

## 12. Glossaire (vocabulaire Parnass à utiliser tel quel)

| Terme | Définition / convention |
|---|---|
| **Théorique** | Prévu, conception, contractuel. |
| **Réel** | Réalisé, exploitation, mesuré. |
| **Tournée** | Suite de trajets planifiés sur un même cycle (récurrente). |
| **Course (Spot / SUP)** | Prestation ponctuelle, chiffrage à la volée. |
| **TRAGO / TRAGZ / PORGO / PORGZ** | Typologies moteur (tracteur gasoil / gaz / porteur gasoil / gaz). |
| **VL / CM / SPL / Polyvalent** | Profils conducteurs (taux journaliers distincts). |
| **GNR** | Gaz Non Routier — carburant officiel du frigo. |
| **CNR** | Comité National Routier — indices d'indexation carburant. |
| **CdC** | Cahier des Charges (contrat client). |
| **AS24** | Réseau stations carburant pro. |
| **Masternaut / Michelin** | Télématique. |
| **Solid / Silae / WinCPL / MyRentCar** | Outils SI Parnass. |
| **Plateforme Parnass** | TMS maison (Phase 1) — **ne plus dire « Parnass 360 »**. |
| **Cockpit économique** | Cible Phase 2 (vocable officiel à utiliser). |
| **H1** | Hypothèse 1 : diviseur jours ouvrés = 21. |
| **Q1-Q4** | Questions de structure ouvertes sur la grille de coûts. |
| **APSAD** | Norme sécurité incendie / véhicule. Sujet Q3. |
| **TK / Trinôme** | Modes de facturation parmi 4 (avec forfait + taux horaire). |
| **TIPCE Auchan** | Cas particulier d'indexation carburant client Auchan. |
| **Solution B (Firas)** | Plan refonte 12-18 mois — **abandonné** au profit du pivot 13/05. |

---

## 13. Métadonnées et historique de ce handover

- **Sources principales** : mémoires Claude (project_parnass_phase2, project_parnass_phase2_6_modules, project_parnass_module_conception), fichiers du dossier `Phase 2/`, dossier PARNASS à la racine.
- **Limites connues** :
  - Pas de visibilité sur les retours client de la restitution du **11/05/2026** (memory antérieure du 07/05 décrit la préparation, pas la restitution réalisée).
  - Pas de visibilité sur les arbitrages Q1-Q4 si tranchés depuis le 11/05.
  - Pas de visibilité sur l'état effectif de la livraison Phase 1 du 17/05 (memory du 13/05 décrit l'intention, pas la réalisation).
- **À mettre à jour systématiquement** dans ce handover après chaque point Pilotage Stratégique :
  - §5.4 (Q1-Q4 — passage en « arbitré »).
  - §5.3 (basculement à 15 ou 16 postes si décidé).
  - §10 (Plan d'attaque — affiner à la maille sprint).
  - §6 (Risques — fermer ce qui est traité, ouvrir ce qui émerge).
- **Versioning** : si tu reprends ce doc, incrémente `version_doc` dans le front-matter et ajoute une ligne d'historique ci-dessous.

### Journal des versions

| Version | Date | Auteur | Changement |
|---|---|---|---|
| 1.0 | 2026-05-19 | Yann + Claude | Création initiale, passation Claude Team — Phase 2 complète. |

---

*Fin du handover. Bonne reprise.*
