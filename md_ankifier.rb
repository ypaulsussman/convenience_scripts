# frozen_string_literal: true

# Run as htmlify_markdown_files.rb path/to/markdown/file

require 'redcarpet'

markdown = File.read(ARGV[0])

htmlified =
  Redcarpet::Markdown
  .new(Redcarpet::Render::HTML.new)
  .render(markdown)
  .gsub('\_', '_')
  .gsub('\- ', '- ')

html_filename = ARGV[0].split('.md').first

File.open("#{html_filename}.html", 'w') { |f| f.write htmlified }
