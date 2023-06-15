# Y's Rando Scriptbin

NB the choice of language for given script is derived entirely from my professional-development needs at the time of writing, and not from any particular suitability of the language for a given task.

- In `node_scripts`:

  - `gcTocScraper.js` is for grabbing _Great Courses_ course lists off their website and making them plaintext/manipulable. (`gcStrings.js` exists solely to provide data for this code.)

  - `image_scraper.js` is for extracting images from a hierarchy of arbitrary depth containing dirs and `.pdf` files.
  
  - `ankify_markdown.js` is for converting your Markdown notes to Anki-friendly HTML.

- In `python_scripts`:
  - `anki_csvifier.py` transforms a bunch of Mandarin<>English Anki-card exports to CSV from their default format.

  - `brach_rename.py` is a one-off for removing the U+221A "Square Root" character from names of a bunch of guided-meditation audio files.

  - `gdo_mocks_builder.py` generates content for a bunch of markdown files (that I could then use for testing whether an 11ty-based SSG was processing them to HTML properly).

- In `ruby_scripts`:
  - `eric_etl/` is for 
    - downloading the '_frequently-used fields_' subset from [ERIC's API](https://eric.ed.gov/?api);
    - munging it slightly to better fit JSON/Elasticsearch; then
    - indexing to Elasticsearch (_note: uses default text-analyzers._)

  - `mia_exploration/` is for
    - indexing [MIA's collection-metadata](https://github.com/artsmia/collection/tree/master/objects) to Elasticsearch (_focuses only on_ `terms`_-bucketable fields_); 
    - exploring the characteristics of what's currently on display.

  - `ankify_markdown.rb` is for converting your Markdown notes to Anki-friendly HTML (and effectively identical to the similarly-named script in the `node_scripts/` dir)

  - `meditations_scraper.rb` is for downloading `.mp3` files from that one meditation guide you like, so you don't have to always access through browser.
  
  - `mobify_markdown.rb` is for converting your Markdown notes to (...old) Kindle-sideloadable `.mobi` files.

- In `shell_scripts`:
    - `print_dirs.sh` is for printing filepaths from a hierarchy of arbitrary depth containing dirs and files (and was my first experiment with using ChatGPT for producing actual code!)