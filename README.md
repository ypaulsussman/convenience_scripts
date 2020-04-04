# Y's Rando Scriptbin

- `eric_etl_1/` is for 
  - downloading the '_frequently-used fields_' subset from [ERIC's API](https://eric.ed.gov/?api);
  - munging it slightly to better fit JSON/Elasticsearch; then
  - indexing to Elasticsearch (_note: uses default text-analyzers._)
- `md_ankifier.rb` is for converting your Markdown notes to Anki-friendly HTML.
- `md_mobifier.rb` is for converting your Markdown notes to sideloadable `.mobi` files.
- `meditations_scraper.rb` is for downloading `.mp3` files from that one, uh, meditation teacher (_nomenclature here?_) you like, so you don't have to always access through browser.
