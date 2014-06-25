var analyticsViewController = angular.module('analytics.view.controller', []);

analyticsViewController.controller('analyticsViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.categorySummary = {};

//		$scope.templates = null;
    	
	
    	$scope.init = function() {
        	$scope.loading = true;
        	$scope.requestType = 'getCategoriessummary';
        	restService.getResource('categoriessummary', null, null).success(requestSuccessHandler).error(requestFailHandler);
    	}
    	

        

        

        
        
// - - - - - - - - - - - - - - - - - - - - CRUD  - - - - - - - - - - - - - - - - - - - - 
        
        

        

// - -  - -  - -  - -  - -  - - NETWORK SUCCESS/FAIL HANDLERS - -  - -  - -  - -  - -  - -  - -  - - 

        function requestSuccessHandler(data, status, headers, config){
        	$scope.loading = false;
            if (data.results.confirmation == 'success') {
            	
            	if ($scope.requestType == 'getCategoriessummary'){
//            		$scope.categorySummary = data.results.summaries;
                	
                	var summaries = data.results.summaries;
                	for (var i=0; i<summaries.length; i++){
                		var summary = summaries[i]; // {"name":"SEE","device":"EDE0AFA7-D090-445F-B240-FDFC42CEC323","started":"2014-06-24 19:43:58 +0000"}
                		
                		
                		
                	}
                	
                	console.log('REQUEST SUCCESS: '+JSON.stringify($scope.categorySummary));
                	
                	
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