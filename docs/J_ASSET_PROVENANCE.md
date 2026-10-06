# J-Series Artwork & Asset Provenance

## Purpose

Every externally sourced visual asset used by the J-series must be independently attributable and redistributable for the app's intended use. Search-result appearance, age, cultural familiarity or apparent public-domain status is not sufficient.

## Preferred asset order

1. Original product-authored SVG/CSS/procedural art.
2. Product-authored derivatives of non-copyrightable geometric/traditional motifs.
3. Verified CC0/public-domain museum artwork.
4. Other explicitly licensed open assets whose license is compatible with redistribution.

Avoid external raster artwork when an original procedural/vector treatment can achieve the same effect.

## Required record

For every external artwork/font/texture:

- internal asset ID;
- asset type;
- title/name;
- creator/artist when known;
- date/period when known;
- source institution/provider;
- canonical object/source URL;
- media/download URL or acquisition path;
- exact rights statement;
- license identifier;
- redistribution allowed: yes/no;
- modification allowed: yes/no;
- attribution requirement;
- retrieval date;
- intended app surfaces;
- transformation notes;
- reviewer/verifier;
- verification date.

Unknown rights => **not admitted**.

## Source pools

### The Metropolitan Museum of Art

The Met Open Access program makes images of public-domain artworks available under CC0. Only objects explicitly identified as Open Access/Public Domain should be admitted.

Research:
- https://www.metmuseum.org/hubs/open-access

### Smithsonian

Smithsonian Open Access exposes reusable CC0 material. Use media records that explicitly indicate CC0 eligibility.

Research:
- https://www.si.edu/openaccess
- https://collections.si.edu/search/

### Library of Congress

The Japanese Fine Prints collection is a valuable research/source pool, but rights must be evaluated item by item. "No known restrictions" is not identical to a universal CC0 grant.

Research:
- https://www.loc.gov/collections/japanese-fine-prints-pre-1915/
- https://www.loc.gov/collections/japanese-fine-prints-pre-1915/about-this-collection/

### Japan House London

Use educational pages as research/reference. Do not redistribute page imagery unless separate reuse terms authorize it.

Research:
- https://www.japanhouselondon.uk/read-and-watch/washi/
- https://www.japanhouselondon.uk/read-and-watch/chiyogami-hand-printed-japanese-paper/
- https://www.japanhouselondon.uk/read-and-watch/japanese-houses/

## Font rule

A font must have a redistributable license compatible with local bundling/offline PWA use before entering the product. Record the font version, upstream source and license. Do not depend on a remote font CDN for the core offline experience.

## Traditional motif rule

Traditional geometric motifs such as seigaiha, asanoha, shippō, ichimatsu and kikkō should be redrawn procedurally/originally rather than copied from modern commercial pattern files.

## Prohibited

- screenshots or crops from contemporary commercial sites;
- copyrighted manga/anime/game art or interface imagery;
- a living artist's work used without explicit permission/license;
- images copied from image search;
- assets with unclear or contradictory rights;
- "old-looking" images assumed to be public domain without verification;
- modern museum photography whose rights status is not explicitly compatible.

## Build direction

J1 should add a machine-readable asset registry before any external visual artwork enters production. J14 should validate that every shipped external asset has a corresponding admitted registry entry.
