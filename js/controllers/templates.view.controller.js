var templatesViewController = angular.module('templates.view.controller', []);

templatesViewController.controller('templatesViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.templates = null;
		$scope.currentTemplate = null;
    	
	
    	$scope.init = function() {
    		console.log('TEMPLATE VC - INIT');
        	$scope.loading = true;
        	restService.getResource('templates', null, null).success(getTemplatesSuccess).error(getTemplatesFail);
    	}
    	
        
        function getTemplatesSuccess(data, status, headers, config) {
        	$scope.loading = false;
            if(data.results.confirmation == 'success') {
            	$scope.templates = data.results.templates;
            	$scope.currentTemplate = $scope.templates[0].name;
            	console.log(JSON.stringify($scope.currentTemplate));
            	
            	return;
            } 
            
            // fail:
            alert(data.results.message);
        }

        function getTemplatesFail(data, status, headers, config) {
            //TODO
        	$scope.loading = false;
        	console.log('Get Templates - FAIL');
        }
        
        $scope.selectTemplate = function(){
        	console.log('Select Template');
        }

        
    }
]);