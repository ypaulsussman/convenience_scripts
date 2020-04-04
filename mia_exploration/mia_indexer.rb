# frozen_string_literal: true

require 'elasticsearch'
require 'json'

# Get this from largest-named dir
DIR_CEILING = 131

class MiaIndexer
  def initialize
    @dir_ct = 0
    @index_body = []
  end

  def add_to_bulk(file_path)
    return unless File.exist?(file_path)

    raw_doc = JSON.parse(File.read(file_path), symbolize_names: true)
    raw_doc[:id] = raw_doc[:id].split('/').last.to_i
    @index_body << { index: { data: raw_doc } }
  rescue => e
    puts "AY, #{file_path} caused #{e}"
  end

  def client
    @client ||= Elasticsearch::Client.new(
      url: 'http://localhost:9200',
      retry_on_failure: 5,
      request_timeout: 30,
      adapter: :typhoeus
      # log: true
    )
  end

  def index_files
    setup_index unless client.indices.exists?(index: 'mia_development')

    while @dir_ct <= DIR_CEILING
      Dir["./collection-master/objects/#{@dir_ct}/*"].each { |fp| add_to_bulk(fp) }

      response = client.bulk(
        index: 'mia_development',
        body: @index_body
      )

      print_errors(response['items']) if response['errors']

      @index_body.clear
      @dir_ct += 1
    end
  end

  def print_errors(items)
    items.each do |i|
      puts "Hey! #{i['index']['error'].inspect}" unless i['index']['error'].nil?
    end
  end

  def setup_index
    # Create instance
    index_settings = { number_of_shards: 1, number_of_replicas: 0 }
    settings = { settings: { index: index_settings } }
    client.indices.create(index: 'mia_development', body: settings)

    # Add mapping
    mappings = JSON.parse(File.read('./mia_mapping.json'), symbolize_names: true).freeze
    client.indices.put_mapping(index: 'mia_development', body: mappings)
  end
end

indexer = MiaIndexer.new
indexer.index_files
