# frozen_string_literal: true

require 'elasticsearch'
require 'json'

# Get this from largest-named file in dir
DOC_CEILING = 764_769

# Connect to ES
client = Elasticsearch::Client.new(
  url: 'http://localhost:9200',
  retry_on_failure: 5,
  request_timeout: 30,
  adapter: :typhoeus
  # log: true
)

unless client.indices.exists?(index: 'eric_development')
  # Create instance
  index_settings = { number_of_shards: 1, number_of_replicas: 0 }
  settings = { settings: { index: index_settings } }
  client.indices.create(index: 'eric_development', body: settings)

  # Add mapping
  MAPPINGS = JSON.parse(File.read('./eric_mapping.json'), symbolize_names: true).freeze
  client.indices.put_mapping(index: 'eric_development', body: MAPPINGS)
end

counter = 0

while counter < DOC_CEILING
  raw_doc = JSON.parse(File.read("./eric_prf/#{counter}.json"), symbolize_names: true).freeze
  index_body = []
  raw_doc[:response][:docs].each do |article|
    index_body << { index: { data: article } }
  end

  response = client.bulk(
    index: 'eric_development',
    body: index_body
  )

  if response['errors']
    response['items'].each do |i|
      puts "Hey! #{i['index']['error'].inspect}" unless i['index']['error'].nil?
    end
  end

  counter += 200
end
