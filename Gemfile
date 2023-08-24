source 'https://rubygems.org'

gem 'jekyll', '~> 4.0'
gem 'rickshaw'

group :jekyll_plugins do
  gem 'jekyll-feed'
  gem 'jekyll-haml-markup'
  gem 'jekyll-seo-tag'
  gem 'jekyll-sitemap'
  gem 'jemoji'
end

install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem 'tzinfo'
  gem 'tzinfo-data'
end
