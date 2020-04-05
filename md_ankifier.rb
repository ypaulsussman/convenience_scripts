# frozen_string_literal: true

# Run as e.g.
# $ ruby md_ankifier.rb path/to/md_file

require 'redcarpet'

markdown = File.read(ARGV[0])

htmlified =
  Redcarpet::Markdown
  .new(Redcarpet::Render::HTML.new)
  .render(markdown)
  .gsub('\_', '_') # for underscores inside codeblocks
  .gsub('\- ', '- ') # for ensuring no <li>'s are added

html_filename = ARGV[0].split('.md').first

File.open("#{html_filename}.html", 'w') { |f| f.write htmlified }
