var templatesViewController = angular.module('templates.view.controller', []);

templatesViewController.controller('templatesViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.templates = null;
		$scope.currentTemplateName = null;
		$scope.currentTemplate = null;
		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
    	
	
    	$scope.init = function() {
        	$scope.loading = true;
        	$scope.requestType = 'getTemplates';
        	restService.getResource('templates', null, null).success(requestSuccessHandler).error(requestFailHandler);
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
        
        $scope.createTemplate = function(){
        	if ($scope.newTemplate.name.length < 1){
        		alert('Please Enter a Valid Name for the Template.');
        		return;
        	}
        	
        	console.log('Create Template: '+JSON.stringify($scope.newTemplate));
        	$scope.loading = true;
        	$scope.requestType = 'createTemplate';
        	restService.postResource('templates', $scope.newTemplate, null).success(requestSuccessHandler).error(requestFailHandler);
        }
        
        $scope.updateCurrentTemplate = function(){
        	if ($scope.currentTemplate==null)
        		return;
        	
        	$scope.loading = true;
        	$scope.requestType = 'updateTemplate';
        	restService.putResource('templates', $scope.currentTemplate, null).success(requestSuccessHandler).error(requestFailHandler);
        }
        

        $scope.deleteCurrentTemplate = function(){
        	console.log('deleteCurrentTemplate');

        }
        

        

// - -  - -  - -  - -  - -  - - NETWORK SUCCESS/FAIL HANDLERS - -  - -  - -  - -  - -  - -  - -  - - 

        function requestSuccessHandler(data, status, headers, config){
        	$scope.loading = false;
            if (data.results.confirmation == 'success') {
        		console.log('REQUEST SUCCESS HANDLER');
            	console.log(JSON.stringify(data.results));
            	
            	if ($scope.requestType == 'getTemplates'){
                	$scope.templates = data.results.templates;
                	$scope.currentTemplate = $scope.templates[0];
                	$scope.currentTemplateName = $scope.currentTemplate.name;
                	return;
            	}

            	if ($scope.requestType == 'createTemplate'){
            		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
            		var template = data.results.template;
            		$scope.templates.unshift(template);        		
                	
                	alert('Template Successfully Created');
                	return;
            	}

            	if ($scope.requestType == 'updateTemplate'){
                	console.log(JSON.stringify(data.results));
                	alert('Template Successfully Updated');
                	return;
            	}

            } 
            
            // fail:
            alert(data.results.message);
        }

        function requestFailHandler(data, status, headers, config, requestId){
        	$scope.loading = false;
        }

        
        
        

    }
]);