// @flow

import debug from 'debug';

export default (namespace: string) => {
  return debug('express-process-manager:' + namespace);
};
