---
layout:   post
title:    undefined method `exists? for File:Class (NoMethodError)
description: >
  Fix the
  undefined method `exists?' for File:Class (NoMethodError)
  in pundit policy generator
date:     2023-06-16 11:20:00 +0530
comments: true
tags:     [ruby, rubygems, pundit]
image:    /assets/images/undefined-method-exists.jpg
---

Recently we upgraded ruby to 3.2.
We started getting the following error:

```ruby
/Users/deepak/.rvm/gems/ruby-3.2.2@my-project/gems/pundit-2.3.0/lib/generators/rspec/templates/policy_spec.rb:1:in `template':
undefined method `exists?' for File:Class (NoMethodError)

Did you mean?  exist?
```

This is how we traced it and fixed it:
<!--more-->

## Solution

**Updated on 20th July 2023**

Pundit `v2.3.1` is
[released](https://github.com/varvet/pundit/tree/v2.3.1)
and updating to the new version should solve this issue.

```ruby
# Gemfile

# https://github.com/varvet/pundit
gem 'pundit', '~> 2.3.1'
```

OR

You can just update pundit using

```sh
bundle update pundit
```

**Original Solution**

We found that the error was raised from pundit gem from this location:

[pundit-2.3.0/lib/generators/rspec/templates/policy_spec.rb](https://github.com/varvet/pundit/blob/16554a5fe814153d05cec133705bd583709a4124/lib/generators/rspec/templates/policy_spec.rb#L1){:target="_blank"}

Turned out that `File.exists?` was first deprecated and later removed in Ruby 3.2 -
Ref
[bf97415c](https://github.com/ruby/ruby/commit/bf97415c02b11a8949f715431aca9eeb6311add2){:target="_blank"}

We also found that it has been fixed in this pull request
[varvet/pundit#754](https://github.com/varvet/pundit/pull/754){:target="_blank"}
but at the time of writing this article this change is not yet released

How we fixed it in our project:

```ruby
# Gemfile

# https://github.com/varvet/pundit
gem 'pundit', git: 'https://github.com/varvet/pundit.git', ref: '5b22078'
```

Note that `ref` is optional but it is recommended to add it.
Having `ref` avoids getting unstable changes from the main branch.

## References

- [ruby/ruby#5352](https://github.com/ruby/ruby/pull/5352){:target="_blank"}
- [varvet/pundit#754](https://github.com/varvet/pundit/pull/754){:target="_blank"}
