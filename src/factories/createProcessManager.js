// @flow

import createDebug from './createDebug';

const debug = createDebug('createProcessManager');

/**
 * Creates /healtz endpoint thats used to signal whether the application is ready to accept connections.
 * Gracefully manages the shutdown process after receiveing SIGTERM signal.
 */
export default (server: *, app: *) => {
  let serverIsReady = false;
  let serverIsShuttingDown = false;

  app.get('/healthz', (req, res) => {
    if (serverIsReady === false) {
      res.status(500).send('SERVER IS NOT READY');
    } else if (serverIsShuttingDown) {
      res.status(500).send('SERVER IS SHUTTING DOWN');
    } else {
      res.send('OK');
    }
  });

  debug('waiting 5 seconds before signaling that the server is ready to accept connections');

  setTimeout(() => {
    debug('signaling that the server is ready to accept connections');

    serverIsReady = true;
  }, 5 * 1000);

  const shutdown = () => {
    serverIsShuttingDown = true;

    server.close((error) => {
      if (error) {
        // @todo Log error
        debug('error', error);

        // eslint-disable-next-line no-process-exit
        process.exit(1);

        return;
      }

      debug('waiting 5 seconds before terminating the process');

      setTimeout(() => {
        // eslint-disable-next-line no-process-exit
        process.exit();
      }, 5 * 1000);
    });
  };

  process.on('SIGTERM', () => {
    debug('got SIGTERM. starting graceful shutdown');

    shutdown();
  });
};
