var templatesViewController = angular.module('templates.view.controller', []);

templatesViewController.controller('templatesViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.entries = {};
		$scope.devices = new Array();
    	$scope.selectedDevice = {'name':'Loading...', 'configuration':{'sequence':[], 'SEE':{'order':[]}, 'GO':{'order':[]}, 'EAT':{'order':[]}, 'SEE':{'order':[]}}};
    	
    	$scope.currentCategory = 'SEE';
    	$scope.currentSubcategory = '';
    	$scope.selectedEntryIndex = 0;
    	
    	// Venue Search Stuff:
    	$scope.searchEntry = '';
    	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };
    	$scope.entriesMap = {};

    	
    	
	
    	$scope.init = function() {
    		console.log('TEMPLATE VC - INIT');
//        	$scope.loading = true;
//        	restService.getResource('entries', null, {'format':'map'}).success(getEntriesSuccess).error(getEntriesFail);
    	}
    	
        
        function getEntriesSuccess(data, status, headers, config) {
            if(data.results.confirmation == 'success') {
//            	console.log(JSON.stringify(data.results));
            	$scope.entries = data.results.entries;
            	
            	restService.getResource('devices', null, null).success(getDevicesSuccess).error(getDevicesFail);
            	return;
            } 
            
            // fail:
            alert(data.results.message);
        }

        function getEntriesFail(data, status, headers, config) {
            //TODO
        	console.log('Get Entries - FAIL');

        }

        function getDevicesSuccess(data, status, headers, config) {
        	$scope.loading = false;
            if(data.results.confirmation == 'success') {
            	$scope.devices = data.results.devices;
            	
            	if ($scope.devices.length > 0)
                	$scope.selectedDevice = $scope.devices[0];
            	
            	$scope.currentCategory = 'SEE';
            	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
            	$scope.currentSubcategory = category.order[0]; // default to first subcategory
            	return;
            } 
            
            alert(data.results.message);
        }

        function getDevicesFail(data, status, headers, config) {
            //TODO
        	console.log('Get Devcies - FAIL');
        }
        
        $scope.selectDevice = function(index) {
        	console.log('Select Device');
        	$scope.selectedDevice = $scope.devices[index];
        	$scope.currentCategory = $scope.selectedDevice.configuration.sequence[0];
        }

        
        $scope.orderForCategory = function(categoryName) {
        	return $scope.selectedDevice.configuration[categoryName].order;
        }
        
        $scope.selectCategory = function(categoryName) {
        	console.log('SELECT CATEGORY: '+categoryName);
        	$scope.currentCategory = categoryName;
        	
        	var category = $scope.selectedDevice.configuration[categoryName];
        	$scope.currentSubcategory = category.order[0]; // default to first subcategory
        	console.log('CURRENT SUB CATEGORY: '+JSON.stringify($scope.currentSubcategory));
        	
        	subcategory = category[$scope.currentSubcategory];
        	console.log(JSON.stringify(subcategory));
        }

        $scope.selectSubcategory = function(categoryName, subcategoryName) {
        	console.log('SELECT SUBATEGORY: '+categoryName+' -- '+subcategoryName);
        	$scope.currentCategory = categoryName;
        	$scope.currentSubcategory = subcategoryName;

        	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
        	var subcategory = category[$scope.currentSubcategory];
        	$scope.selectedEntryIndex = 0;
        }
        
        $scope.updateSubcategory = function() {
        	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
        	var subcategory = category[$scope.currentSubcategory];
        	$scope.selectedEntryIndex = 0;
        	console.log('UPDATE SUBCATEGORY: '+$scope.currentSubcategory+' = '+JSON.stringify(subcategory));
        }
        
        
        $scope.numberOfPages = function() {
        	var pagesArray = new Array();
        	
        	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
        	var subcategory = category[$scope.currentSubcategory];
        	
        	if (subcategory==null)
        		return pagesArray;
        	
        	var g = subcategory.length/5;
        	var groups = Math.floor(g);
        	
        	var numPages = 2*groups;
        	var leftOver = subcategory.length%5;
        	if (leftOver > 0)
        		numPages++;
        	if (leftOver > 3)
        		numPages++;

        	console.log('PAGES: '+numPages);
        	for (var i=0; i<numPages; i++){
            	pagesArray.push(i);
        	}

        	return pagesArray;
        }

        function calculateEntryIndex(index, offset){
        	console.log('calculate entry index: '+index+', offset='+offset);
        	var i = 0;
        	
//        	if (offset < 3)
//        		i = 2.5*(index)+offset;
//        	else
//            	i = 2.5*(index-1)+offset;
        	
        	var factor = 4;
        	if (offset < 3)
        		i = factor*(index)+offset;
        	else if (offset < 5)
            	i = factor*(index-1)+offset;
        	else
            	i = factor*(index-2)+offset;

        	
        	return i;
        }
    	


        $scope.entryForIndex = function(index, offset) {
        	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
        	var subcategory = category[$scope.currentSubcategory];

        	var i = calculateEntryIndex(index, offset);
        	
        	if (i%1 != 0){ // not an integer, ignore. shouldn't happen.
        		console.log('TEST 1 -- '+i);
        		return;
        	} 
        	
        	var entryId = subcategory[i];
        	if (entryId==null) {
        		console.log('TEST 2');
        		return;

        	}
        	
        	var entry = $scope.entries[entryId];
        	if (entry==null) {
        		console.log('TEST 3');
        		return;
        		
        	}

    		console.log('TEST 4 -- '+i);
        	return entry.title;
        }
        
        $scope.selectEntryIndex = function(index, offset) {
        	var i = calculateEntryIndex(index, offset);
        	$scope.selectedEntryIndex = i;
        	console.log('SELECT ENTRY INDEX: '+i);
        } 
        
        $scope.selectFoursquareEntry = function(index){
        	entry = $scope.searchResults.foursquare[index];
        	console.log('Search Foursquare Entry: '+JSON.stringify(entry));
        }
        
        $scope.selectInfoHubsEntry = function(index){
        	entry = $scope.searchResults.infohubs[index];
        	console.log('Search InfoHubs Entry: '+JSON.stringify(entry));

        	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
        	var subcategory = category[$scope.currentSubcategory];
        	subcategory[$scope.selectedEntryIndex] = entry.id;
        	$scope.selectedEntryIndex++;
        }
        
        
        $scope.onFileSelect = function($files, property) {
    	    $scope.loading = true;
        	console.log('SELECT IMAGE: '+property);
//            var url = '/api/upload?resource=device&property='+property+'&id='+$scope.selectedDevice.uuid;
            var url = '/api/upload';
        	
        	
            $http.get(url).success(function(data, status, headers, config) {
                results = data['results'];
                confirmation = results['confirmation'];
                if (confirmation=='success'){
                	uploadString = results['upload'];
                    console.log('UPLOAD STRING: '+uploadString);
                    
                	
                    //$files: an array of files selected, each file has name, size, and type.
                    for (var i = 0; i < $files.length; i++) {
                      var file = $files[i];
                      $scope.upload = $upload.upload({
                        url: uploadString, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file // or list of files: $files for html5 only
                        /* set the file formData name ('Content-Desposition'). Default is 'file' */
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                        //formDataAppender: function(formData, key, val){}
                      }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                      }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                        
                        results = data['results'];
                        
                        //TODO: check confirmation key for success
                        confirmation = results['confirmation'];
                	    $scope.loading = false;
                        if (confirmation=='success'){
                            updatedDevice = results['device'];
                            
                            if (property=='logo'){
                            	$scope.selectedDevice.image = updatedDevice['image'];
                            }
                        }
                        else{
                        	alert(results['message']);
                        }
                      });
                      //.error(...)
                      //.then(success, error, progress); 
                      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
                    }
                    
                    /* alternative way of uploading, send the file binary with the file's content-type.
                       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
                       It could also be used to monitor the progress of a normal http post/put request with large data*/
                    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
                }
                else {
            	    $scope.loading = false;
                    alert(results['message']);
                }
            }).error(function(data, status, headers, config) {
        	    $scope.loading = false;
                console.log("error", data, status, headers, config);
            });
          };
        
        
        
        
    	

	
    }
]);