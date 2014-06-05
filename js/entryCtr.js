var app = angular.module('Entry', []);

app.controller("EntryController", function($scope, $http){
	$scope.loading = false;
		
	// Venue Search Stuff:
	$scope.searchEntry = '';
	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };
	$scope.entriesMap = {};

	$scope.selectedEntry = '';
	$scope.entries = new Array();
	
	$scope.newEntry = {
        secondaryUrls: {}
    };
    
	
    $scope.init = function() {
    	console.log('HOME CTR INIT');
//    	fetchEntries();
//    	fetchDevices();
    }    
    
    $scope.formattedDate = function(date) {
        var newDate = new Date(date).toString();
        return moment(newDate).format('MMM D, h:mma');
    }
    
    function fetchEntries() {
    	$scope.loading = true;
        var url = '/api/entries';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	var entries = results['entries'];
            	
            	for (var i=0; i<entries.length; i++){
            		var entry = entries[i];
            		$scope.entriesMap[entry.id] = entry;
            	}
            	
            } 
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.searchEntries = function() {

    	if ($scope.searchEntry.length<1){
    		alert('Please Enter a Valid Venue.');
    		return;
    	}

	    $scope.loading = true;
    	
        var url = '/api/entries?search='+$scope.searchEntry;
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
    	entry = $scope.searchResults.foursquare[index];
    	console.log('Search Foursquare Entry: '+JSON.stringify(entry));
    	
		$scope.primaryURL = "test";
    	
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
        console.log('test json: '+json);
        
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
        var purpose = document.getElementById("secondaryUrl-purpose").value;
        var url = document.getElementById("secondaryUrl-url").value;
        console.log(purpose);
        console.log(url);

        $scope.newEntry.secondaryUrls[purpose] = url;
		document.getElementById("secondaryUrl-url").value = "";
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

