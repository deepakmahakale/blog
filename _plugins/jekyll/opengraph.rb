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
      file_path = "/assets/images/opengraph/#{id}.jpg"
      full_file_path = "#{Dir.pwd}#{file_path}"

      # Check if the file already exists in the 'opengraph' foldler, return early if it does
      if File.exist?(full_file_path)
        puts "File exists #{full_file_path}"
      else
        title = context['page']['title'].tr('`', '').tr('"', "\'")
        # the script to be called with the formatted title, and resolving filename
        script = "node #{Dir.pwd}/opengraph.js -t \"#{title}\" -a '#{context['page']['author']}' -d '#{context['page']['date'].strftime('%b %e, %Y')}' -f '#{full_file_path}'"

        system(script)

        puts script
      end

      # Get the site variable
      site = context.registers[:site]

      # Add the file to the list of static_files needed to be copied to the _site
      site.static_files << Jekyll::StaticFile.new(site, site.source, '/assets/images/opengraph/', "#{id}.jpg")

      file_path
    end
  end
end

Liquid::Template.register_tag('og_filter', Jekyll::OGFilter)
