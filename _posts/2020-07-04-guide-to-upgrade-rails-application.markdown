---
layout:   post
title:    A step by step guide to upgrade rails 4 application to rails 5
date:     2020-07-04 22:00:00 +0530
comments: true
tags: [rails, rails-upgrade]
image: /assets/images/guide-to-upgrade-rails-application.png
---

Upgrading an application can be tedious if you don't have good test coverage.

This article covers the common issues you might face while upgrading the from rails 4 to 5.

If you are upgrading to ruby 2.7 export `RUBYOPT="-W0"` to avoid getting your screen filled up with deprecations warnings

```bash
export RUBYOPT="-W0"

bundle exec rspec

# OR use

RUBYOPT="-W0" bundle exec rspec
```

<!--more-->

## Step 1: Upgrading ruby and bundle install

- Install the required ruby version

  - rvm

    ```shell
    rvm install ruby 2.x.x
    ```
  - rbenv

    ```shell
    rbenv install 2.x.x
    ```
- Change the ruby version in `.ruby-version`, `.rvmrc` or `Gemfile`.

- Install `bundler`

  ```shell
  gem install bundler
  ```

- Change the rails version

  ```ruby
  # Gemfile
  gem 'rails', '4.2.0'
  # To
  gem 'rails', '5.2.4'
  ```

- run bundle install

  If you don't need specific versions of the gems locked it is better to remove the specified version.

  ```shell
  bundle install
  ```

- Additional Note: (`ruby 2.7`)

  Ruby 2.7 has removed these gems which were default in prior versions.

  Add the following gems to your gemfile

  ```ruby
  gem 'e2mmap'
  gem 'scanf'
  gem 'thwait'
  ```

## Step 2: Config changes

At this point you should be able to install all the dependencies.
But, in order to start the application we need to do some config changes.

- **Remove**

  ```ruby
  # config/application.rb
  config.active_record.raise_in_transactional_callbacks = true
  ```

- **Change**

  ```ruby
  # config/application.rb
  config.serve_static_assets = true
  config.static_cache_control = 'public, max-age=3600'

  # to

  config.public_file_server.enabled
  config.public_file_server.headers = { 'Cache-Control' => 'public, max-age=3600' }
  ```

  ```ruby
  # routes.rb
  ProjectName::Application.routes.draw do

  # to

  Rails.application.routes.draw do
  ```

- **Create** `config/initializers/assets.rb`

  ```ruby
  # config/initializers/assets.rb
  Rails.application.config.assets.version = '1.0'

  Rails.application.config.assets.precompile += [
    'application.css', 'application.js'
  ]
  ```

## Step 3: Model & Controller changes

### Controllers

- Replace all `*_filter` callbacks in favor of `*_action`

  ```ruby
  before_filter
  skip_before_filter

  # to

  before_action
  skip_before_action
  ```

  ```ruby
  redirect_to(:back)

  # to

  redirect_back(fallback_location: root_path)
  ```


### Models

- Models now inherit from `ApplicationRecord`

  - **Create**

    ```ruby
    # app/models/application_record.rb
    class ApplicationRecord < ActiveRecord::Base
      self.abstract_class = true
    end
    ```

  - **Change** the following in all models

    ```ruby
    class User < ActiveRecord::Base

    # to

    class User < ApplicationRecord
    ```

- `belongs_to` is compulsory now.

  Use `optional: true` if the association is ever going to be `nil`

  ```ruby
  class Post < ActiveRecord::Base
    belongs_to :user, optional: true
    #....
  ```

  :information_source: **In a huge application you might want to keep the old behavior.
  You can change the settings globally in application.rb**

  ```ruby
  # config/application.rb
  config.active_record.belongs_to_required_by_default = false
  ```

  ```ruby
  after_destroy :send_confirmation, if: 'user&.notifications_enabled?'

  after_destroy :send_confirmation, if: Proc.new { user&.notifications_enabled? }
  ```

- attribute_changed? is deprecated in after_save callback

  > Deprecated: <attribute>_changed? doesn't work as expected in after_save & after_update <br>
  > Use saved_change_to_<attribute>?

  ```ruby
  # Old
  after_save :send_email, if: :email_changed?

  # New
  after_save :send_email, if: -> { saved_change_to_email? }
  ```

  > Deprecated: <attribute>_was doesn't work as expected in after_save & after_update <br>
  > Use <attribute>_before_last_save

  ```ruby
  # Old
  archived_record.assign_attributes(email: email_was)

  # New
  archived_record.assign_attributes(email: email_before_last_save)
  ```

- AASM if you're upgrading aasm from 3 -> 4

  Follow this guide - [Upgrading AASM from version 3 to 4](https://github.com/aasm/aasm/blob/master/README_FROM_VERSION_3_TO_4.md)

### Mailers

- Mailers now inherit from ApplicationMailer

  ```ruby
  # app/mailers/application_mailer.rb
  class ApplicationMailer < ActionMailer::Base
    default from: "sample@#{ActionMailer::Base.smtp_settings[:domain]}"
  end
  ```

  ```ruby
  class UserMailer < ActionMailer::Base
  # to
  class UserMailer < ApplicationMailer
  ```

## Step 4: Migration changes

> Directly inheriting from ActiveRecord::Migration is not supported.<br>
> Please specify the Rails release the migration was written for:

- Change the following

  ```ruby
  class CreateUsers < ActiveRecord::Migration

  # to

  class CreateUsers < ActiveRecord::Migration[4.2]
  ```

  :information_source: **Easy fix**

  ```bash
  grep -rl "ActiveRecord::Migration$" db | xargs sed -i "s/ActiveRecord::Migration/ActiveRecord::Migration[4.2]/g"
  ```

## Step 5: Necessary changes in RSpec

### RSpec

- Upgrading FactoryBot to 5

  > DEPRECATION WARNING: Static attributes will be removed in FactoryBot 5.0.<br>
  > Please use dynamic attributes instead by wrapping the attribute value
  > in a block:

  ```ruby
  FactoryBot.define do
    factory :user do
      name 'John'         # Bad & will throw error
      # To
      name { 'John' }     # Good
  ```

  :information_source: **Easy Fix:**

  use `rubocop` to auto fix the format

  Ref: [https://thoughtbot.com/blog/deprecating-static-attributes-in-factory_bot-4-11](https://thoughtbot.com/blog/deprecating-static-attributes-in-factory_bot-4-11)

  ```shell
  rubocop -a spec/factories/xyz.rb --only FactoryBot/AttributeDefinedStatically
  ```

  Make sure to comment the following in `rubocop.yml` temporarily

  ```yml
  AllCops:
    Exclude:
      - 'spec/**/*'
  ```

- Fix controller specs

  ```ruby
  get :show, id: request.id
  xhr :get, :summary, id: request.id

  # to

  get :show, params: { id: request.id }
  get :summary, params: { id: request.id }, xhr: true
  ```

  :information_source: This gem does it for you - [rails5-spec-converter](https://github.com/tjgrathwell/rails5-spec-converter)



## Additional Issues you might get while running RSpec

- undefined method 'sort' for `#<ActionController::Parameters:>`

  Do not use Hash methods on params
