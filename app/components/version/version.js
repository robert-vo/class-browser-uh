'use strict';

angular.module('classBrowserUHApp.version', [
  'classBrowserUHApp.version.interpolate-filter',
  'classBrowserUHApp.version.version-directive'
])

.value('version', '0.1');
