var app = angular.module('Entry', ['angularFileUpload']);

app.controller("EntryController", function($scope, $http, $upload){
	$scope.loading = false;
		
	// Venue Search Stuff:
	$scope.searchEntry = '';
	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };
	$scope.entriesMap = {};

	$scope.selectedEntry = '';
	$scope.entries = new Array();
	
	$scope.newEntry = {
		rating: "1",
        secondaryUrls: {}
    };
    
    $scope.searchFilter = '';
    $scope.secondaryUrlPurpose = 'Menu';
    $scope.secondaryUrlLink = '';
    
    $scope.newEntryLogo = '';
    $scope.newEntryBackgroundImage = '';
	
    $scope.init = function() {
    	console.log('HOME CTR INIT');
//    	fetchEntries();
//    	fetchDevices();
    }    
    
    $scope.formattedDate = function(date) {
        var newDate = new Date(date).toString();
        return moment(newDate).format('MMM D, h:mma');
    }
        
    
    $scope.searchEntries = function() {

    	if ($scope.searchEntry.length<1){
    		alert('Please Enter a Valid Venue.');
    		return;
    	}

	    $scope.loading = true;
	    $scope.selectedEntry = '';
	        	
        var url = '/api/entries?search='+$scope.searchEntry+'&foursquarefilter='+$scope.searchFilter;
        //this url only returns names for foursquare venues
        
        $http.get(url).success(function(data, status, headers, config) {
    	    $scope.loading = false;
            results = data['results'];
          //  console.log('RESULTS: '+JSON.stringify(results));
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	entries = results['entries'];
                $scope.searchResults.infohubs = entries.infohubs;
                console.log('infohubs:'+JSON.stringify(entries.infohubs));
                $scope.searchResults.foursquare = entries.foursquare;
                console.log('\n\nfoursquare:'+JSON.stringify(entries.foursquare));
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
    	$scope.selectedEntry = $scope.searchResults.foursquare[index];
    	console.log('Search Foursquare Entry: '+JSON.stringify($scope.selectedEntry));
    	
    }
    
    $scope.selectInfoHubsEntry = function(index){
    	$scope.selectedEntry = $scope.searchResults.infohubs[index];
    	console.log('Search InfoHubs Entry: '+JSON.stringify($scope.selectedEntry));
		
    }
    
    $scope.updateEntry = function() {

	    $scope.loading = true;
    	
        var url = '/api/entries/'+$scope.selectedEntry.id;
        console.log('Update entry with ID: '+$scope.selectedEntry.id);
        
        var json = JSON.stringify($scope.selectedEntry);

        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
			$scope.loading = false;
            if (confirmation=='success'){
                alert($scope.selectedEntry.id+' successfully updated');
                console.log(results);
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
	    	$scope.loading = false;
            console.log("error", data, status, headers, config);
        });
    }
    
    
    
    $scope.deleteButton = function(purpose) {
//    	console.log('Delete Button: '+purpose);
    	delete $scope.newEntry.secondaryUrls[purpose];
    }
    
	$scope.addSecondaryUrl = function() {
        console.log("addSecondaryUrls");
        var purpose = $scope.secondaryUrlPurpose;
        var url = $scope.secondaryUrlLink;
        console.log(purpose);
        console.log(url);

        $scope.newEntry.secondaryUrls[purpose] = url;
		$scope.secondaryUrlLink = "";
        console.log(JSON.stringify($scope.newEntry.secondaryUrls));
    }

    $scope.purposeKeys = function() {
//        console.log(Object.keys($scope.newEntry.secondaryUrls));
		if($scope.newEntry.secondaryUrls){
        	return Object.keys($scope.newEntry.secondaryUrls);	
		}
    }
    
    
    $scope.submitEntry = function(){
    
	   	$scope.loading = true;
	
		json = JSON.stringify($scope.newEntry);
		console.log('newEntry: JSON = '+json);

		var url = '/api/entries';
		$http.post(url, json)
		.success(function(data, status, headers, config) {
	    	$scope.loading = false;
		    results = data['results'];
		    confirmation = results['confirmation'];
		    if (confirmation=='success'){
		    	$scope.newEntry = {}; // clear out the new entry reference
		    	entry = results['entry'];
		    	console.log('SUCCESS: '+JSON.stringify(entry));

		    	$scope.entries = results['entries'];
		    }
		    else{
		    	alert(results['message']);
		    }

		}).error(function(data, status, headers, config) {
	    	$scope.loading = false;
		    console.log("error", data, status, headers, config);
		});
	}
	
	$scope.onFileSelect = function($files, property) {
	    $scope.loading = true;
    	console.log('SELECT IMAGE: '+property);
//        var url = '/api/upload?resource=entry&property='+property+'&id='+$scope.selectedDevice.uuid;
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
                    	
                    	console.log(JSON.stringify(results));
                    	
                    	if (property == 'logo'){
	                    	$scope.newEntryLogo = results;
                    	}
                    	else if (property == 'backgroundImage'){
	                    	$scope.newEntryBackgroundImage = results;
                    	}
                    	
/*
                        updatedDevice = results['device'];
                        
                        if (property=='logo'){
                        	$scope.selectedDevice.image = updatedDevice['image'];
                        }
*/
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

