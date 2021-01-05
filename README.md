# Y's Rando Scriptbin

- In `ruby_scripts`:
  - `eric_etl/` is for 
    - downloading the '_frequently-used fields_' subset from [ERIC's API](https://eric.ed.gov/?api);
    - munging it slightly to better fit JSON/Elasticsearch; then
    - indexing to Elasticsearch (_note: uses default text-analyzers._)

  - `mia_exploration/` is for
    - indexing [MIA's collection-metadata](https://github.com/artsmia/collection/tree/master/objects) to Elasticsearch (_focuses only on_ `terms`_-bucketable fields_); 
    - exploring the characteristics of what's currently on display.

  - `ankify_markdown.rb` is for converting your Markdown notes to Anki-friendly HTML.

  - `mobify_markdown.rb` is for converting your Markdown notes to (...old) Kindle-sideloadable `.mobi` files.

  - `meditations_scraper.rb` is for downloading `.mp3` files from that one meditation guide you like, so you don't have to always access through browser.

- In `node_scripts`:

  - `gcTocScraper.js` is for grabbing _Great Courses_ course lists off their website and making them plaintext/manipulable.

  - `image_scraper.js` is for extracting images from a hierarchy of arbitrary depth containing dirs and `.pdf` files.