# frozen_string_literal: true

require 'nokogiri'
require 'net/http'

# future URLs go here
uris = ['add', 'to', 'me!']

def callup(uri, ssl)
  Net::HTTP.start(uri.host, uri.port, use_ssl: ssl) do |http|
    request = Net::HTTP::Get.new uri
    http.request request
  end
end

uris.each do |uri|
  # Hit the OG url
  response = callup(URI(uri), true)

  # Hit the redirect
  response = callup(URI(response['location']), true)

  # Grab the download url; prep the filename
  response = Nokogiri::HTML.parse(response.body).at_css('.powerpress_link_d')
  # TODO: .split(/tarabrach\//)[1] should work, too, right?
  filename = response['href'].split(/(tarabrach\/)/)[2]

  # Hit the download url
  response = callup(URI(response['href']), false)

  # Hit the redirect
  response = callup(URI(response['location']), false)

  # Save the file
  File.open("./brach_meditations/#{filename}", 'w') { |f| f.write response.body }
end
