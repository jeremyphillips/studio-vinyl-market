# Discogs Integration

The Discogs integration allows Studio editors to pre-fill release fields directly from the Discogs database. It is a two-step workflow: **link** a Discogs release to establish the reference, then **import** the fields you want.

No raw Discogs data is stored in Sanity. Import writes into the document's own typed fields, which can be freely edited afterwards.

---

## Linking a release

Open any Release document and navigate to the **Discogs** tab. Use the search input to find the matching Discogs release by title, artist, or catalogue number. Selecting a result stores only the Discogs `releaseId` and `masterId` on the document.

---

## Import panel

Once a release is linked, an **Import from Discogs** panel appears below the linked-ID card.

### Step 1 — Fetch

Click **Fetch from Discogs** to load the full release detail from the Discogs API. No writes happen at this step.

### Step 2 — Select and import

After fetching, each importable field appears as a checkbox row:

| Row            | What is imported                                          |
| -------------- | --------------------------------------------------------- |
| Tracklist      | Flat list of tracks written into `discs` as a single disc |
| Media type     | e.g. Vinyl, CD, Cassette                                  |
| Classification | LP, EP, or Single                                         |
| Speed          | 33⅓, 45, or 78 RPM                                        |
| Size           | 7", 10", or 12"                                           |
| Channels       | Mono or Stereo                                            |
| Descriptions   | Reissue, Repress, Promo, Compilation                      |

Rows are **pre-checked** and can be toggled individually. A row is **disabled** (greyed out) when the adapter cannot find a recognised value in the Discogs data — nothing will be written for that field regardless.

A **caution card** appears under a row when the document already has a value for that field, so editors know the import will overwrite it.

Click **Import selected** to write all checked fields in a single patch. A toast confirms which fields were written.

---

## Adapter mapping rules

All Discogs → Sanity field mapping lives in `apps/studio/lib/discogs-adapter.ts`. The adapter operates on `formats[0]` (the first format entry) only.

| Sanity field     | Discogs source                                    | Logic                                                                                                 |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `mediaType`      | `formats[0].name`                                 | Exact match: `Vinyl` → `vinyl`, `Shellac` → `shellac`, `CD` → `cd`, `Cassette` → `cassette`           |
| `classification` | `formats[0].name`, then `formats[0].descriptions` | First of `LP`, `EP`, `Single` found in either; name takes precedence                                  |
| `speed`          | `formats[0].descriptions`                         | Parses `"33 ⅓ RPM"` / `"33 1/3 RPM"` / `"33⅓ RPM"` → `"33"`; `"45 RPM"` → `"45"`; `"78 RPM"` → `"78"` |
| `size`           | `formats[0].descriptions`                         | Matches leading number `7`, `10`, or `12` (ignores quote character encoding) → `7"`, `10"`, `12"`     |
| `channels`       | `formats[0].descriptions`                         | `"Stereo"` → `"stereo"`; `"Mono"` → `"mono"`                                                          |
| `descriptions`   | `formats[0].descriptions`                         | Filters against known `releaseDescriptionOptions` titles: Reissue, Repress, Promo, Compilation        |

The `descriptions` mapping is derived from `releaseDescriptionOptions` in `packages/release-constants/index.ts` at build time — adding or removing an option there automatically updates what the adapter syncs.

---

## Known limitations

- **First format only.** Multi-format releases (e.g. 2xLP + bonus 7") use only `formats[0]`. The remaining entries are ignored.
- **`unofficial-release` is not synced.** Discogs does not reliably tag bootlegs with a matching description string, so this value is intentionally excluded from the adapter's description map.
- **`mediaType` skipped for LP/EP/Single format names.** When the Discogs format `name` is `LP`, `EP`, or `Single` (rather than `Vinyl`), `mediaType` is not set — these names imply vinyl by convention but are not a reliable signal.
- **Tracklist is always single-disc.** All tracks are collapsed into one disc entry. Multi-disc releases (e.g. 2xLP with separate sides) require manual restructuring after import.
- **Speed not parsed from `text`.** The free-text `formats[0].text` field is intentionally skipped; only structured `descriptions` entries are parsed.

---

## Extending the adapter

To add a new importable field:

1. Add the mapping logic to `apps/studio/lib/discogs-adapter.ts` and extend `DiscogsReleasePatch`.
2. Add a unit test in `apps/studio/lib/discogs-adapter.test.ts`.
3. Add a `FormatRow` in `DiscogsImportPanel.tsx` with the appropriate `useFormValue` read for the overwrite warning.
4. Include the field in `fieldOps` inside the `useMemo` in the panel.
5. Run `yarn typegen && yarn typecheck && yarn lint && yarn test`.

If the new field requires data not currently returned by the API proxy (`apps/web/app/api/discogs/releases/[id]/`), extend `DiscogsReleaseDetail` in `packages/discogs/index.ts` and update `mapDiscogsReleaseDetail` accordingly, then run `yarn typegen`.
