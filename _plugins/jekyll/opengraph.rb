require 'rmagick'
require 'rickshaw'

module Jekyll
  class OGFilter < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      # This creates an image id hash from the page id in Jekyll
      id = context['page']['id'].to_sha1

      # Check if the file already exists in the 'opengraph' foldler, return early if it does
      if File.exist?("#{Dir.pwd}/opengraph/#{id}.png")
        puts "File exists #{Dir.pwd}/opengraph/#{id}.png}"
      else

        # the script to be called with the formatted title, and resolving filename
        script = "node #{Dir.pwd}/opengraph.js -t '#{context['page']['title']}' -d '#{context['page']['date'].strftime('%e %B %Y')}' -f '#{Dir.pwd}/opengraph/#{id}.png'"

        system(script)

        puts script
      end

      # Get the site variable
      site = context.registers[:site]

      # Add the file to the list of static_files needed to be copied to the _site
      site.static_files << Jekyll::StaticFile.new(site, site.source, '/opengraph/', "#{id}.png")

      "/opengraph/#{id}.png"
    end
  end
end

Liquid::Template.register_tag('og_filter', Jekyll::OGFilter)
