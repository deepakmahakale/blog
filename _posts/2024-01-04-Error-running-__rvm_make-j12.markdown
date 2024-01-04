---
layout:   post
title:    Error running '__rvm_make -j12'
description: Unable to install ruby with rvm due to - Error running __rvm_make -j12
date:     2024-01-04 15:00:00 +0530
comments: true
tags:     [rvm, ruby]
image:    autogenerate
---

```
Error running '__rvm_make -j12',
please read /Users/deepak/.rvm/log/1704350883_ruby-3.3.0/make.log
```

<!--more-->

### Full Log

```
rvm install 3.3.0
Searching for binary rubies, this might take some time.
No binary rubies available for: osx/13.4/x86_64/ruby-3.3.0.
Continuing with compilation. Please read 'rvm help mount' to get more information on binary rubies.
Checking requirements for osx.
Updating certificates bundle '/usr/local/etc/openssl@1.1/cert.pem'
Requirements installation successful.
Installing Ruby from source to: /Users/deepak/.rvm/rubies/ruby-3.3.0, this may take a while depending on your cpu(s)...
ruby-3.3.0 - #downloading ruby-3.3.0, this may take a while depending on your connection...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 21.0M  100 21.0M    0     0  15.5M      0  0:00:01  0:00:01 --:--:-- 15.6M
No checksum for downloaded archive, recording checksum in user configuration.
ruby-3.3.0 - #extracting ruby-3.3.0 to /Users/deepak/.rvm/src/ruby-3.3.0 - please wait
ruby-3.3.0 - #configuring - please wait
ruby-3.3.0 - #post-configuration - please wait
ruby-3.3.0 - #compiling - please wait
Error running '__rvm_make -j12',
please read /Users/deepak/.rvm/log/1704350883_ruby-3.3.0/make.log

There has been an error while running make. Halting the installation.
```

### Solution

```sh
rvm install ruby-3.3.0 -C --with-openssl-dir=/usr/local/etc/openssl@3
```
