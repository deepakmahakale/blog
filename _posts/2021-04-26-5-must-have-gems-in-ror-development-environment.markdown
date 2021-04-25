---
layout:   post
title:    5 Must have gems in Ruby on Rails development environment.
date:     2021-04-26 08:00:00 +0530
comments: true
tags: [ruby, rubygems]
---

I have been developing rails applications since 2014.
I started my career with rails and since then I have worked on numerous
rails projects.

These are a few gems which I like to add in almost all of my projects
(including the personal projects).
These gems definitely increase the productivity and make the developer's
life easier.

These are my top 5 gems you should have in your development environment.

<!--more-->

### #1. [Xray-rails](https://github.com/brentd/xray-rails){:target="_blank"}

```ruby
gem 'xray-rails', group: 'development'
```

As the name suggests this gem helps you see the xray of your application.

It will show you all the rendered partials on the current page with **⌘+shift+x**(Mac) or **ctrl+shift+x**.

![Xray-Rails]({{site.baseurl}}/assets/images/posts/xray-rails.png)
*source: https://github.com/brentd/xray-rails*

What's interesting is that you can click on the overlay and the partial will be opened in your editor.

The default editor is sublime but you can always configure the editor of choice.
Add the following in `~/.xrayconfig`

```yaml
:editor: '/usr/local/bin/code' # VSCode
# :editor: '/usr/local/bin/subl' # Sublime
```

### #2. [RuboCop](https://github.com/rubocop/rubocop){:target="_blank"}

```ruby
gem 'rubocop', require: false
```

I believe this gem requires no introduction. But still, in case you haven't heard of it - rubocop is a linter for ruby.

The above line is an understatement because, rubocop doesn't just lint you code
or reports the problem in you code.
But, rubocop can actually fix most of the issues automatically.

A true life saver.

To lint you code you can run the following command:

```bash
# Check all the ruby files in the project
rubocop

# Check a specific file
rubocop app/models/user.rb

# Check and fix the autocorrectable issues
rubocop -a
```

extensions for editors like sublime and VSCode are also available.

![rubocop vscode extension]({{site.baseurl}}/assets/images/posts/rubocop.png)

### #3. [Bullet](https://github.com/flyerhzm/bullet){:target="_blank"}

```ruby
gem 'bullet', group: 'development'
```

Bullet gem helps you detect the **N+1** queries while early in the development cycle.
It helps identify the queries which are causing **N+1** queries and helps you fix them before the code hits production.

```erb
<tbody>
  <% @posts.each do |post| %>
    <tr>
      <td><%= post.title %></td>
      <td><%= post.body %></td>
      <td><%= post.author.name %></td>
    </tr>
  <% end %>
</tbody>
```

This is an example of N+1 query report by the bullet gem

```log
user: deepak
GET /posts
USE eager loading detected
  Post => [:author]
  Add to your query: .includes([:author])
Call stack
  /Users/deepak/workspace/rails-versions/rails-6-1/app/views/posts/index.html.erb:19:in `block in _app_views_posts_index_html_erb___4164323537883834576_18480'
  /Users/deepak/workspace/rails-versions/rails-6-1/app/views/posts/index.html.erb:15:in `_app_views_posts_index_html_erb___4164323537883834576_18480'
```

### #4. [Awesome Print](https://github.com/awesome-print/awesome_print){:target="_blank"}


```ruby
gem 'awesome_print', group: 'development'
```

**Awesome Print** pretty prints the Ruby objects in full color with indentation.

example:

Do this in console and you will get a pretty representation with all the attributes of the post object.

```ruby
require "awesome_print"
ap Post.last
```

This is an example of how the post object looks

![awesome_print]({{site.baseurl}}/assets/images/posts/awesome_print.png)

To avoid requiring it every time you start the console you can do the following:

Add the following in your `~/.irbrc`

```ruby
require 'awesome_print'
AwesomePrint.irb!
```

Remember, you can always comment these lines if you ever decide manually require them.

### #5. [Rspec-rails](https://github.com/rspec/rspec-rails){:target="_blank"}

```ruby
group :development, :test do
  gem 'rspec-rails'
end
```

Last but not the least `rspec-rails` is a must to to ensure you application is
well tested and to avoid any unintended bugs in the existing features.

RSpec also provides lot of methods to test various scenarios. Visit the github repository of rspec-rails for the list of available [matchers](https://github.com/rspec/rspec-rails#helpful-rails-matchers)

Make sure to run the following command once you have installed the gem.

```bash
$ rails generate rspec:install
      create  .rspec
      create  spec
      create  spec/spec_helper.rb
      create  spec/rails_helper.rb
```

This will generate a few files and ensure that the next time you generate a
scaffold the test files for the same are generated automatically.

You may want to add the following in `.rspec` to avoid requiring `rails_helper` in every test file and for better output of the test results.

```
--color
--require rails_helper
--format documentation
```
