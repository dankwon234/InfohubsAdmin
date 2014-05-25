var app = angular.module('Home', ['angularFileUpload']);

app.controller("HomeController", function($scope, $http, $upload){
	$scope.devices = new Array();
	$scope.selectedDevice = {'name':'Loading...', 'configuration':{'sequence':[], 'SEE':{'order':[]}, 'GO':{'order':[]}, 'EAT':{'order':[]}, 'SEE':{'order':[]}}};
	$scope.currentCategory = 'SEE';
	$scope.loading = false;
	
	// Venue Search Stuff:
	$scope.searchEntry = '';
	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };

	
    $scope.init = function() {
    	console.log('HOME CTR INIT');
    	fetchDevices();
    }
    
    function fetchDevices() {
        var url = '/api/devices';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.devices = results['devices'];
//                console.log('DEVICES: '+JSON.stringify($scope.devices));
                
                $scope.selectedDevice = $scope.devices[0];
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    
    $scope.selectDevice = function(index) {
    	$scope.selectedDevice = $scope.devices[index];
    	$scope.currentCategory = $scope.selectedDevice.configuration.sequence[0];
    }
    
    function selectDevice(index){
    	console.log('SELECT DEVICE: '+index);
    	$scope.selectedDevice = $scope.devices[index];
    }

    $scope.updateSelectedDevice = function() {
    	console.log('Update Selected Device: '+JSON.stringify($scope.selectedDevice));
        var url = '/api/devices/'+$scope.selectedDevice.uuid;
        
        var json = JSON.stringify($scope.selectedDevice);
        console.log(json);
        
        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                alert($scope.selectedDevice.name+' successfully updated');
                console.log(results);
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    	
    }
    
    $scope.deleteSelectedDevice = function() {
    	console.log('DELETE DEVICE');
    	
    	var r = confirm("Are You Sure?");
    	if (r==false)
    		return;
    	
        var url = '/api/devices/'+$scope.selectedDevice.uuid;
        $http.delete(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	fetchDevices();
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.formattedDate = function(date) {
        var newDate = new Date(date).toString();
        return moment(newDate).format('MMM D, h:mma');
    }
    
    $scope.orderForCategory = function(categoryName) {
//    	console.log('ORDER FOR CATEGORY: '+categoryName);
    	return $scope.selectedDevice.configuration[categoryName].order;
    }
    
    $scope.selectCategory = function(categoryName) {
    	console.log('SELECT CATEGORY: '+categoryName);
    	$scope.currentCategory = categoryName;
    }
    
    $scope.editSubcategory = function() {
    	console.log('EDIT SUBCATEGORY: '+$scope.currentCategory);
    	
    }
    

    
    $scope.searchEntries = function() {
	    $scope.loading = true;

    	if ($scope.searchEntry.length<1){
    		alert('Please Enter a Valid Venue.');
    		return;
    	}
    	
    	foursquarefilter = 'shops';
    	if ($scope.currentCategory == 'SEE'){
    		foursquarefilter = 'shops';
    	}
    	if ($scope.currentCategory == 'EAT'){
    		foursquarefilter = 'food';
    	}
    	if ($scope.currentCategory == 'SHOP'){
    		foursquarefilter = 'shops';
    	}
    	if ($scope.currentCategory == 'GO'){
    		foursquarefilter = 'shops';
    	}

    	
//    	console.log('SEARCH ENTRIES: '+JSON.stringify($scope.selectedDevice));
    	latLong = $scope.selectedDevice.latitude+','+$scope.selectedDevice.longitude;

        var url = '/api/entries?search='+$scope.searchEntry+'&ll='+latLong+'&foursquarefilter='+foursquarefilter;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            console.log('RESULTS: '+JSON.stringify(results));
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	entries = results['entries'];
                $scope.searchResults.infohubs = entries.infohubs;
                $scope.searchResults.foursquare = entries.foursquare;
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.onFileSelect = function($files, property) {
    	console.log('SELECT IMAGE: '+property);
        var url = '/api/upload?resource=device&property='+property+'&id='+$scope.selectedDevice.uuid;
    	
    	
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
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
      };
    

});


