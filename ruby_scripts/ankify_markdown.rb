# frozen_string_literal: true

# Run as e.g.
# $ ruby ankify_markdown.rb path/to/md_file
# May need to run from ~ or ~/Desktop, depending on user permissions

require 'bundler/inline'
gemfile do
  source 'https://rubygems.org'
  gem 'redcarpet'
end

markdown = File.read(ARGV[0])

htmlified =
  Redcarpet::Markdown
  .new(Redcarpet::Render::HTML.new, fenced_code_blocks: true)
  .render(markdown)

html_filename = ARGV[0].split('.md').first

File.open("#{html_filename}.html", 'w') { |f| f.write htmlified }
