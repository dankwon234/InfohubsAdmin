var templatesViewController = angular.module('templates.view.controller', []);

templatesViewController.controller('templatesViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.templates = null;
		$scope.currentTemplateName = null;
		$scope.currentTemplate = null;
		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
    	
	
    	$scope.init = function() {
        	$scope.loading = true;
        	restService.getResource('templates', null, null).success(getTemplatesSuccess).error(getTemplatesFail);
    	}
    	

        $scope.changeCurrentTemplate = function(){
        	for (var i=0; i<$scope.templates.length; i++){
        		var template = $scope.templates[i];
        		if (template.name == $scope.currentTemplateName){
        			$scope.currentTemplate = template;
        			break;
        		}
        	}
        }
        

        $scope.templateNames = function(){
        	var names = new Array();
        	if ($scope.templates==null)
        		return names;
        	
        	for (var i=0; i<$scope.templates.length; i++){
        		var template = $scope.templates[i];
        		names.push(template.name);
        	}
        	
        	return names;
        }
        
        
        
        // - -  - -  - -  - -  - -  - - CRUD  - -  - -  - -  - -  - -  - -  - -  - - 
        
        function getTemplatesSuccess(data, status, headers, config) {
        	$scope.loading = false;
            if(data.results.confirmation == 'success') {
            	$scope.templates = data.results.templates;
            	$scope.currentTemplate = $scope.templates[0];
            	$scope.currentTemplateName = $scope.currentTemplate.name;
            	
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
        
        $scope.createTemplate = function(){
        	if ($scope.newTemplate.name.length < 1){
        		alert('Please Enter a Valid Name for the Template.');
        		return;
        	}
        	
        	console.log('Create Template: '+JSON.stringify($scope.newTemplate));
        	$scope.loading = true;
        	restService.postResource('templates', $scope.newTemplate, null).success(postTemplatesSuccess).error(postTemplatesFail);
        }
        
        $scope.updateCurrentTemplate = function(){
        	if ($scope.currentTemplate==null)
        		return;
        	
        	$scope.loading = true;
        	restService.putResource('templates', $scope.currentTemplate, null).success(putTemplatesSuccess).error(putTemplatesFail);
        }
        
        
        function putTemplatesSuccess(data, status, headers, config) {
        	$scope.loading = false;
            if(data.results.confirmation == 'success') {
            	console.log(JSON.stringify(data.results));
            	alert('Template Successfully Updated');
            	return;
            } 
            
            // fail:
            alert(data.results.message);
        }
        
        function putTemplatesFail(data, status, headers, config) {
            //TODO
        	$scope.loading = false;
        	console.log('Get Templates - FAIL');
        }


        function postTemplatesSuccess(data, status, headers, config) {
        	$scope.loading = false;
            if(data.results.confirmation == 'success') {
            	console.log(JSON.stringify(data.results));
            	
        		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
        		var template = data.results.template;
        		$scope.templates.unshift(template);        		
            	
            	alert('Template Successfully Created');
            	return;
            } 
            
            // fail:
            alert(data.results.message);
        }
        
        function postTemplatesFail(data, status, headers, config) {
            //TODO
        	$scope.loading = false;
        	console.log('Get Templates - FAIL');
        }
        

        $scope.deleteCurrentTemplate = function(){
        	console.log('deleteCurrentTemplate');

        }
        
        

    }
]);