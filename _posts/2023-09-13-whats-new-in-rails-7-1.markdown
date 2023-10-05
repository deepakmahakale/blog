---
layout:   post
title:    What's new in Rails 7.1
description: >
  Dockerfile, BYO Authentication, Async queries, Composite Primary Keys, Bun support and more.
date:     2023-09-13 12:00:00 +0530
comments: true
tags:     [rails, rails7-1]
image:    autogenerate
author: deepakmahakale
---

**Update:**

Rails 7.1 Beta 1 is [released](https://edgeguides.rubyonrails.org/7_1_release_notes.html) on September 13, 2023.

Rails 7.1 is [released](https://rubyonrails.org/2023/10/5/Rails-7-1-0-has-been-released) on October 5, 2023.

Let's see what is new in rails 7.1

## Dockerfile

Rails will now auto generate docker related files in the application.

```sh
Dockerfile
.dockerignore
bin/docker-entrypoint
```

Build and run your application using docker

```sh
docker build -t app .
docker volume create app-storage
docker run --rm -it -v app-storage:/rails/storage -p 3000:3000 --env RAILS_MASTER_KEY=<your-config-master-key> app
```

<!--more-->

## BYO Authentication

New addition **`normalizes`** for attribute normalization.

Normalization is applied when the attribute is assigned or updated, and the normalized value will be persisted to the database.

```ruby
class User < ApplicationRecord
  normalizes :email, with: -> email { email.strip.downcase }
  normalizes :phone, with: -> phone {
    phone.delete("^0-9").delete_prefix("1")
  }
end

# Normalize email address before creating a user
user = User.create(email: " CRUISE-CONTROL@EXAMPLE.COM\n")
user.email                  # => "cruise-control@example.com"

# Normalize email address before finding a user
user = User.find_by(email: "\tCRUISE-CONTROL@EXAMPLE.COM ")
user.email                  # => "cruise-control@example.com"
user.email_before_type_cast # => "cruise-control@example.com"

# Database query
User.where(email: "\tCRUISE-CONTROL@EXAMPLE.COM ").count
# => 1

# Normalize value on the fly
User.normalize_value_for(:phone, "+1 (555) 867-5309")
# => "5558675309"
```

Enhancement to **`has_secure_password`** to verify the current password while updating the password.

```ruby
# Schema: User(email:string, password_digest:string)
class User < ActiveRecord::Base
  has_secure_password
end

user = User.new(
  email: "johndoe@example.com",
  password: "john#123",
  password_confirmation: "john#123"
)
user.save
# => true
user.update(password: "john@123", password_challenge: "")
# => false, challenge doesn't authenticate
user.update(password: "john@123", password_challenge: "john#123")
# => true
```

## Async queries
Intorduction of new Async queries.

Async queries return `ActiveRecord::Promise` object.

**Supported methods:**

- `async_count`
- `async_sum`
- `async_minimum`
- `async_maximum`
- `async_average`
- `async_pluck`
- `async_pick`
- `async_find_by_sql`
- `async_count_by_sql`

```ruby
> promise = Product.where(state: 'active').async_count
  Product Count (0.4ms)  SELECT COUNT(*) FROM "products" WHERE "products"."state" = $1  [["state", "active"]]
# => #<ActiveRecord::Promise status=complete>
> promise.value
# => 16
> promise = Product.where(state: 'active').async_sum(:price)
  Product Sum (0.2ms)  SELECT SUM("products"."price") FROM "products" WHERE "products"."state" = $1  [["state", "active"]]
# => #<ActiveRecord::Promise status=complete>
> promise.value
# => 491.0
> promise = Product.where(state: 'active').async_minimum(:price)
  Product Minimum (0.3ms)  SELECT MIN("products"."price") FROM "products" WHERE "products"."state" = $1  [["state", "active"]]
# => #<ActiveRecord::Promise status=complete>
> promise.value
# => 5.0
> promise = Product.where(state: 'active').async_maximum(:price)
  Product Maximum (0.3ms)  SELECT MAX("products"."price") FROM "products" WHERE "products"."state" = $1  [["state", "active"]]
# => #<ActiveRecord::Promise status=complete>
> promise.value
# => 100.0
> promise = Product.where(state: 'active').async_average(:price)
  Product Average (0.3ms)  SELECT AVG("products"."price") FROM "products" WHERE "products"."state" = $1  [["state", "active"]]
# => #<ActiveRecord::Promise status=complete>
> promise.value
# => 30.6875
```

## Enqueue multiple jobs at once using `perform_all_later`

Enqueue multiple jobs simultaneously with the help of `perform_all_later`.
This new addition allows you to enqueue multiple jobs without triggering the callbacks.

```ruby
# Enqueueing individual jobs
ActiveJob.perform_all_later(
  MyJob.new("hello", 42),
  MyJob.new("world", 0)
)

# Enqueueing an array of jobs
user_jobs = User.pluck(:id).map { |id| UserJob.new(user_id: id) }
ActiveJob.perform_all_later(user_jobs)
```
## Composite Primary Keys

You can add composite primary keys now.

```ruby
# app/models/book.rb
class Book < ApplicationRecord
  self.primary_key = [:author_id, :id]
  belongs_to :author
end
```

If you don't want to modify the database schema,
you can make use of `query_constraints` as `virtual primary key`.

```ruby
class Book < ActiveRecord::Base
  query_constraints :author_id, :id
end
```

## Support for Bun

Bun has got popular!
so rails decided to
[add support for bun](https://github.com/rails/jsbundling-rails/pull/167){:target="_blank"}
in `jsbundling-rails`

Now, you can generate a new rails application using
[Bun](https://bun.sh){:target="_blank"}
as your javascript runtime.

```sh
$ rails new blog --javascript=bun
```

OR if you want to add bun in an existing application

```sh
$ bin/rails javascript:install:bun
```

## TLDR;

- Default docker support for rails - [Read](#dockerfile)
- Normalization methods - [Read](#byo-authentication)
- Current password check before updating new password - [Read](#byo-authentication)
- Async Queries - [Read](#async-queries)
- Support to Enqueue multiple jobs at once using `perform_all_later` - [Read](#enqueue-multiple-jobs-at-once-using-perform_all_later)
- Composite Primary Keys - [Read](#composite-primary-keys)
- Support for [Bun](#support-for-bun)
