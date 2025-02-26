---
layout:   post
title:    How to downgrade the postgres addon version on Heroku.
description: Step by step guide on how to downgrade the postgres addon version on Heroku.
date:     2024-09-21 19:00:00 +0530
comments: true
tags:     [heroku, restore, downgrade, postgres]
image:    autogenerate
---

We recently had to downgrade the version of the postgres addon on Heroku.

Our production was running on version `14` and our staging server was running on `16`.

We wanted to downgrade the staging server to version `14` to ensure that the versions are consistent across environments.

This is how we did it.

<!--more-->

First, we created a new postgres addon with the version we wanted to downgrade to.

```bash
heroku addons:create heroku-postgresql:essential-1 --version 14 --app my-heroku-app-name
```

We checked the status of the new postgres addon.

**NOTE:** `HEROKU_POSTGRESQL_NAVY` is the new postgres addon we created.

```bash
heroku pg:info --app my-heroku-app-name

=== HEROKU_POSTGRESQL_NAVY_URL

Plan:                  essential-1
Status:                Available
Connections:           unknown/20
PG Version:            14.11
Created:               2024-09-20 11:24
Data Size:             unknown usage / 10 GB (In compliance)
Tables:                0/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-rugged-12345

=== DATABASE_URL, HEROKU_POSTGRESQL_TEAL_URL

Plan:                  essential-1
Status:                Available
Connections:           0/20
PG Version:            16.2
Created:               2024-08-20 08:17
Data Size:             3.99 GB / 10 GB (39.9%) (In compliance)
Tables:                65/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-horizontal-12345
```

We turned the maintenance mode on to prevent any writes to the database.

```bash
heroku maintenance:on --app my-heroku-app-name
```

Then we captured latest backup of our current database.

```bash
heroku pg:backups:capture --app my-heroku-app-name

# Ensure the backup is complete
heroku pg:backups --app my-heroku-app-name

=== Backups

Id   Created at                Status                              Size     Database
──── ───────────────────────── ─────────────────────────────────── ──────── ────────
b003 2024-09-20 12:01:30 +0000 Running (processed 475.00MB)        475.00MB TEAL
b002 2024-07-05 10:39:42 +0000 Completed 2024-07-05 10:40:13 +0000 642.51MB TEAL
```

We got the URL of the backup we just captured.

```bash
heroku pg:backups:url b003 --app my-heroku-app-name

https://xfrtu.s3.amazonaws.com/73e...52
```

We restored the backup to the new postgres addon we created.

```bash
heroku pg:backups:restore https://xfrtu.s3.amazonaws.com/73e...52 HEROKU_POSTGRESQL_NAVY_URL --app my-heroku-app-name
```

Ensure the restore is complete before proceeding.
Check for the number of tables, the data size etc.

```bash
heroku pg:info --app my-heroku-app-name

=== HEROKU_POSTGRESQL_NAVY_URL

Plan:                  essential-1
Status:                Available
Connections:           0/20
PG Version:            14.11
Created:               2024-09-20 11:24
Data Size:             3.97 GB / 10 GB (39.69%) (In compliance)
Tables:                65/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-rugged-12345

=== DATABASE_URL, HEROKU_POSTGRESQL_TEAL_URL

Plan:                  essential-1
Status:                Available
Connections:           0/20
PG Version:            16.2
Created:               2024-08-20 08:17
Data Size:             3.99 GB / 10 GB (39.9%) (In compliance)
Tables:                65/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-horizontal-12345
```

Promote the new database to be the primary database.

```bash
heroku pg:promote HEROKU_POSTGRESQL_WHITE --app my-heroku-app-name

Ensuring an alternate alias for existing DATABASE_URL... HEROKU_POSTGRESQL_TEAL_URL
Promoting postgresql-rugged-12345 to DATABASE_URL on ⬢ my-heroku-app-name... done
Checking release phase... pg:promote succeeded.
```

Ensure the new database is the primary database. You will see the `DATABASE_URL` is pointing to the new database now.

```bash
heroku pg:info --app my-heroku-app-name

=== DATABASE_URL, HEROKU_POSTGRESQL_NAVY_URL

Plan:                  essential-1
Status:                Available
Connections:           0/20
PG Version:            14.11
Created:               2024-09-20 11:24
Data Size:             3.97 GB / 10 GB (39.72%) (In compliance)
Tables:                65/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-rugged-12345

=== HEROKU_POSTGRESQL_TEAL_URL

Plan:                  essential-1
Status:                Available
Connections:           0/20
PG Version:            16.2
Created:               2024-08-20 08:17
Data Size:             3.99 GB / 10 GB (39.9%) (In compliance)
Tables:                65/4000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-horizontal-12345
```

Turn off the maintenance mode.

```bash
heroku maintenance:off --app my-heroku-app-name
```

Finally, we destroyed the old postgres addon.

```bash
heroku addons:destroy HEROKU_POSTGRESQL_TEAL --app my-heroku-app-name
```

That's it. We successfully downgraded the postgres addon version on Heroku.

## References

- [Importing and Exporting Heroku Postgres Databases](https://devcenter.heroku.com/articles/heroku-postgres-import-export){:target="_blank"}
- [Upgrading the Version of a Heroku Postgres Database](https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases){:target="_blank"}
