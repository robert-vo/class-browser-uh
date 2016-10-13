'use strict';

angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredClass',
    'classBrowserUHApp.navbar',
    'environment',
    'smart-table',
    'nya.bootstrap.select',
    'ngSanitize',
    'angular.backtop',
    'ngMaterial',
]).controller('EnvVarCtrl', ['$scope', 'envService', function ($scope, envService) {
    $scope.environment = envService.get();
    $scope.vars = envService.read('all');
    $scope.apiUrl = $scope.vars.apiUrl;
}])
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

function BasicDemoCtrl($mdPanel) {
    this._mdPanel = $mdPanel;
    this.disableParentScroll = true;
}

BasicDemoCtrl.prototype.showDialog = function(aClass) {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
        attachTo: angular.element(document.body),
        controller: PanelDialogCtrl,
        controllerAs: 'ctrl',
        disableParentScroll: this.disableParentScroll,
        templateUrl: 'views/templates/panel.template.html',
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        position: position,
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        aClass: aClass
    };

    this._mdPanel.open(config);
};


function PanelDialogCtrl(mdPanelRef) {
    this._mdPanelRef = mdPanelRef;
}

PanelDialogCtrl.prototype.closeDialog = function() {
    var panelRef = this._mdPanelRef;

    panelRef && panelRef.close().then(function() {
        angular.element(document.querySelector('.demo-dialog-open-button')).focus();
        panelRef.destroy();
    });
};

PanelDialogCtrl.prototype.getClass = function() {
    return this._mdPanelRef.config.aClass;
};

function PanelMenuCtrl(mdPanelRef, $timeout) {
    this._mdPanelRef = mdPanelRef;
    $timeout(function() {
        var selected = document.querySelector('.demo-menu-item.selected');
        if (selected) {
            angular.element(selected).focus();
        } else {
            angular.element(document.querySelectorAll('.demo-menu-item')[0]).focus();
        }
    });
}

PanelMenuCtrl.prototype.onKeydown = function($event, dessert) {
    var handled;
    switch ($event.which) {
        case 38: // Up Arrow.
            var els = document.querySelectorAll('.demo-menu-item');
            var index = indexOf(els, document.activeElement);
            var prevIndex = (index + els.length - 1) % els.length;
            els[prevIndex].focus();
            handled = true;
            break;

        case 40: // Down Arrow.
            var els = document.querySelectorAll('.demo-menu-item');
            var index = indexOf(els, document.activeElement);
            var nextIndex = (index + 1) % els.length;
            els[nextIndex].focus();
            handled = true;
            break;

        case 13: // Enter.
        case 32: // Space.
            this.selectDessert(dessert);
            handled = true;
            break;

        case 9: // Tab.
            this._mdPanelRef && this._mdPanelRef.close();
    }

    if (handled) {
        $event.preventDefault();
        $event.stopImmediatePropagation();
    }

    function indexOf(nodeList, element) {
        for (var item, i = 0; item = nodeList[i]; i++) {
            if (item === element) {
                return i;
            }
        }
        return -1;
    }
};