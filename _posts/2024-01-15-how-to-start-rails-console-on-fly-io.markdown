---
title: How to start rails console on fly.io
description: &description >
  Open a Rails console on Fly.io with fly ssh console --pty -C, and fix "rails: command not found" after fly ssh console.
excerpt: *description
date: 2024-01-15 12:00:00 +0530
last_modified_at: 2026-11-12 12:00:00 +0530
categories:
  - Deployment
tags:
  - Fly.io
  - Rails Console
header:
  og_image: /assets/images/opengraph/2024-01-15-how-to-start-rails-console-on-fly-io.png
---

### Issue

```sh
fly ssh console
Connecting to fdaa:0:xxxx:xxx:xxx:xxxx:xxxx:2... complete
root@4xxxxxxxxxx8:/app# rails c
-bash: rails: command not found
```

<!--more-->

### Solution

```sh
fly ssh console --pty -C "/app/bin/rails console"
```

- `fly ssh console`: Initiates an SSH session.
- `--pty`: Lets you interact with the remote terminal.
- `-C`: Used to pass a command to be executed on the remote server once the SSH connection is established.
- `/app/bin/rails console`: The command to start the rails console. NOTE: `app` here is not the app folder inside the rails app. It is the root folder of the rails app.

**Rails 7.1 and newer:** the generated Dockerfile puts the app in `/rails` instead of `/app`, so the command becomes:

```sh
fly ssh console --pty -C "/rails/bin/rails console"
```

Not sure which? Run `fly ssh console` and `pwd` shows the folder.


```sh
fly ssh console --pty -C "/app/bin/rails console"

Connecting to fdaa:0:xxxx:xxx:xxx:xxxx:xxxx:2... complete
Loading production environment (Rails 7.0.7.2)
irb(main):001:0> User.count
=> 1879
```
