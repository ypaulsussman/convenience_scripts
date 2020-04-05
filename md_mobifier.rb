# frozen_string_literal: true

# Run as e.g.
# $ ruby md_mobifier.rb /path/to/md_files
filenames = Dir.glob('*.md', base: ARGV[0])

# convert md to epub
processed_filenames = []
filenames.each do |f|
  processed = f.split('.md').first.gsub(/[\W]/, '_').downcase
  processed_filenames << (processed + '.epub')
  epub_success = system("pandoc '#{ARGV[0]}/#{f}' -o #{processed}.epub")
  p "epubifying broke on #{f}.md" && break unless epub_success
end

# Move to unified dir... can pandoc really not do this?
Dir.mkdir './epub_files'
processed_filenames.each do |f|
  File.rename f, "./epub_files/#{f}"
end

# convert epub to mobi
Dir.mkdir './mobi_files'
processed_filenames.each do |f|
  mobi_success =
    system(
      '/Applications/calibre.app/Contents/MacOS/ebook-convert'\
      " epub_files/#{f}"\
      " mobi_files/#{f.split('.epub').first}.mobi"
    )
  p "mobifying broke on #{f}" unless mobi_success
end

system('rm -rf ./epub_files')
