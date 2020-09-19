# frozen_string_literal: true

require 'typhoeus'

class EricExtractor
  # DOCS_COUNT = (1_005_034 + 1000)
  DOCS_COUNT = (764_769 + 1000)
  def initialize
    @counter = 0
  end

  def chat_with_eric
    take_five until @counter > DOCS_COUNT
  end

  def take_five
    hydra = Typhoeus::Hydra.new
    5.times do |section|
      location = @counter + (section * 200)
      request =
        Typhoeus::Request.new(
          'https://api.ies.ed.gov/eric?search=peerreviewed:F&format=json' \
          "&rows=200&start=#{location}",
          followlocation: true
        )

      request.on_complete do |response|
        unless response.code == 200
          raise StandardError, "at #{@counter}, #{section}: #{response.code}, #{response.body}"
        end

        File.open("./eric_prf/#{location}.json", 'w') { |f| f.write response.body }
      end
      hydra.queue(request)
    end
    hydra.run
    @counter += 1000
  end
end

collecting = EricExtractor.new
collecting.chat_with_eric
