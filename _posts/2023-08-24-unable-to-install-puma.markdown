---
layout:   post
title:    Error installing puma - Failed to build gem native extension
description: >
  A solution to install puma
date:     2023-08-24 12:00:00 +0530
comments: true
tags:     [puma, rubygems]
image:
---

```sh
Building native extensions. This could take a while...
ERROR: Error installing puma:
ERROR: Failed to build gem native extension.
```

<!--more-->

### Full Log

```
ERROR:  Error installing puma:
	ERROR: Failed to build gem native extension.

    current directory: /Users/deepak/.rvm/gems/ruby-3.2.1/gems/puma-6.0.0/ext/puma_http11
/Users/deepak/.rvm/rubies/ruby-3.2.1/bin/ruby -I /Users/deepak/.rvm/rubies/ruby-3.2.1/lib/ruby/3.2.0 extconf.rb
using OpenSSL pkgconfig (openssl.pc)
checking for openssl/bio.h... yes
checking for DTLS_method() in openssl/ssl.h... yes
checking for SSL_CTX_set_session_cache_mode(NULL, 0) in openssl/ssl.h... yes
checking for TLS_server_method() in openssl/ssl.h... yes
checking for SSL_CTX_set_min_proto_version(NULL, 0) in openssl/ssl.h... yes
checking for X509_STORE_up_ref()... yes
checking for SSL_CTX_set_ecdh_auto(NULL, 0) in openssl/ssl.h... yes
checking for SSL_CTX_set_dh_auto(NULL, 0) in openssl/ssl.h... yes
checking for SSL_get1_peer_certificate() in openssl/ssl.h... no
checking for Random.bytes... yes
creating Makefile

current directory: /Users/deepak/.rvm/gems/ruby-3.2.1/gems/puma-6.0.0/ext/puma_http11
make DESTDIR\= sitearchdir\=./.gem.20230824-67730-rq9jqk sitelibdir\=./.gem.20230824-67730-rq9jqk clean

current directory: /Users/deepak/.rvm/gems/ruby-3.2.1/gems/puma-6.0.0/ext/puma_http11
make DESTDIR\= sitearchdir\=./.gem.20230824-67730-rq9jqk sitelibdir\=./.gem.20230824-67730-rq9jqk
compiling http11_parser.c
compiling mini_ssl.c
compiling puma_http11.c
linking shared-object puma/puma_http11.bundle
Undefined symbols for architecture x86_64:
  "_SSL_get1_peer_certificate", referenced from:
      _engine_peercert in mini_ssl.o
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
make: *** [puma_http11.bundle] Error 1

make failed, exit code 2

Gem files will remain installed in /Users/deepak/.rvm/gems/ruby-3.2.1/gems/puma-6.0.0 for inspection.
Results logged to /Users/deepak/.rvm/gems/ruby-3.2.1/extensions/x86_64-darwin-22/3.2.0/puma-6.0.0/gem_make.out
```

### Solution for Puma < 6.0

```sh
PUMA_DISABLE_SSL=true gem install puma -v "5.6.7"
```

If you're facing issue with bundle install

Run

```sh
export PUMA_DISABLE_SSL=1

bundle install
```

### Solution for Puma > 6.0

```sh
PUMA_DISABLE_SSL=1 gem install puma -v "6.2.1"
```

If you're facing issue with bundle install

Run

```sh
export PUMA_DISABLE_SSL=1

bundle install
```
