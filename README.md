# express-process-manager

[![Travis build status](http://img.shields.io/travis/gajus/express-process-manager/master.svg?style=flat-square)](https://travis-ci.org/gajus/express-process-manager)
[![NPM version](http://img.shields.io/npm/v/express-process-manager.svg?style=flat-square)](https://www.npmjs.org/package/express-process-manager)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Abstracts initialisation and shutdown of Express.js services.

> Disclaimer: I just needed something that works for my Kubernetes setup.
> This is far from a customisable service that could work across many
> projects in different environments.  

## Behaviour

Creates `/healthz` health-check endpoint.

The health-check endpoint responds:

* `500` status code, message "SERVER IS NOT READY" when server is initialising.
* `500` status code, message "SERVER IS SHUTTING DOWN" when server is shutting down.
* `200` status code, message "OK" when server is accepting new connections.

The default behaviour is:

* Service becomes ready 5 seconds after initialisation of the process manager.
* Service enters graceful shutdown after receiving `SIGTERM`. Service shutdowns after 5 seconds.

## Usage

```js
import express from 'express';
import {
  createProcessManager
} from 'express-process-manager';

const app = express();

const server = app.listen(8080);

createProcessManager(server, app);

```
