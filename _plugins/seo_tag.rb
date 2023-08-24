# frozen_string_literal: true

require 'jekyll'
require 'jekyll-seo-tag/version'

module Jekyll
  class SeoTag < Liquid::Tag
    class << self
      alias old_template_path template_path

      def template_path
        @template_path ||= begin
          override = File.expand_path '../_includes/seo.html', File.dirname(__FILE__)
          override if File.exist? override
        end
        @template_path ||= old_template_path
      end
    end
  end
end

Liquid::Template.register_tag('seo', Jekyll::SeoTag)
