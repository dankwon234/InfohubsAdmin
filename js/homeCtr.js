var app = angular.module('Home', ['angularFileUpload']);

app.controller("HomeController", function($scope, $http, $upload){
	$scope.devices = new Array();
	$scope.selectedDevice = {'name':'Loading...', 'configuration':{'sequence':[], 'SEE':{'order':[]}, 'GO':{'order':[]}, 'EAT':{'order':[]}, 'SEE':{'order':[]}}};
	$scope.currentCategory = 'SEE';
	$scope.currentSubcategory = '';
	$scope.loading = false;
	$scope.selectedEntryIndex = 0;
	
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
                
                // set default category and subcategory:
            	$scope.currentCategory = 'SEE';
            	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
            	$scope.currentSubcategory = category.order[0]; // default to first subcategory
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
    	
    	var category = $scope.selectedDevice.configuration[categoryName];
    	$scope.currentSubcategory = category.order[0]; // default to first subcategory
    	console.log('CURRENT SUB CATEGORY: '+JSON.stringify($scope.currentSubcategory));
    	
    	subcategory = category[$scope.currentSubcategory];
    	console.log(JSON.stringify(subcategory));
    }

    
    $scope.selectSubcategory = function() {
    	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
    	
    	var subcategory = category[$scope.currentSubcategory];
    	console.log('SELECT SUBCATEGORY: '+$scope.currentSubcategory+' = '+JSON.stringify(subcategory));
    }
    
    
    $scope.editSubcategory = function() {
    	console.log('EDIT SUBCATEGORY: '+$scope.currentSubcategory);
    	
    }
    
    $scope.numberOfPages = function() {
    	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
    	var subcategory = category[$scope.currentSubcategory];
    	
    	var g = subcategory.length/5;
    	var groups = Math.floor(g);
    	
    	var numPages = 2*groups;
    	var leftOver = subcategory.length%5;
    	if (leftOver > 0)
    		numPages++;
    	if (leftOver > 3)
    		numPages++;

    	console.log('PAGES: '+numPages);
    	var pagesArray = new Array();
    	for (var i=0; i<numPages; i++){
        	pagesArray.push(i);
    	}

    	return pagesArray;
    }

    
    $scope.searchEntries = function() {

    	if ($scope.searchEntry.length<1){
    		alert('Please Enter a Valid Venue.');
    		return;
    	}

	    $scope.loading = true;

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

    	
    	latLong = $scope.selectedDevice.latitude+','+$scope.selectedDevice.longitude;

        var url = '/api/entries?search='+$scope.searchEntry+'&ll='+latLong+'&foursquarefilter='+foursquarefilter;
        $http.get(url).success(function(data, status, headers, config) {
    	    $scope.loading = false;
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
    	    $scope.loading = false;
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.selectFoursquareEntry = function(index){
    	entry = $scope.searchResults.foursquare[index];
    	console.log('Search Foursquare Entry: '+JSON.stringify(entry));
    	
    }
    
    $scope.selectInfoHubsEntry = function(index){
    	entry = $scope.searchResults.infohubs[index];
    	console.log('Search InfoHubs Entry: '+JSON.stringify(entry));
    	
    }
    
    $scope.entryForIndex = function(index, offset) {
//    	console.log('ENTRY FOR INDEX: '+index+', OFFSET: '+offset);
    	
    	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
    	var subcategory = category[$scope.currentSubcategory];
    	console.log('ENTRY FOR INDEX: '+JSON.stringify(subcategory));

    	var i = calculateEntryIndex(index, offset);
    	return subcategory[i];
    }
    
    $scope.selectEntryIndex = function(index, offset) {
    	var i = calculateEntryIndex(index, offset);
    	$scope.selectedEntryIndex = i;
    	console.log('SELECT ENTRY INDEX: '+i);
    } 
    
    function calculateEntryIndex(index, offset){
    	var i = 0;
    	if (offset < 3)
    		i = 2.5*(index)+offset;
    	else
        	i = 2.5*(index-1)+offset;
    	
    	return i;
    }
    
    
    
    $scope.onFileSelect = function($files, property) {
	    $scope.loading = true;
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
    

});


app.directive('spinner', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            startSpinner: '=spin'
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var opts = {
              lines: 13,
              length: 20,
              width: 10,
              radius: 30,
              corners: 1,
              rotate: 0,
              direction: 1,
              color: '#000',
              speed: 1,
              trail: 60,
              shadow: false,
              hwaccel: false,
              className: 'spinner',
              zIndex: 2e9
            };
            var spinner = new Spinner(opts);
            scope.$watch('startSpinner', function (startSpinner) {
                if (startSpinner) {
                    spinner.spin(element[0]);
                } 
                else {
                    spinner.stop();
                }
            });
        }
    }
});

