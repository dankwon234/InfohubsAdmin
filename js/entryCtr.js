var app = angular.module('Entry', []);

app.controller("EntryController", function($scope, $http){
	$scope.loading = false;
		
	// Venue Search Stuff:
	$scope.searchEntry = '';
	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };
	$scope.entriesMap = {};

	
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

    	foursquarefilter = 'shops';
    	
    	//Dan's code to continue without LL throws error
    	latLong = '40.76528,-73.97898';

        var url = '/api/entries?search='+$scope.searchEntry+'&ll='+latLong+'&foursquarefilter='+foursquarefilter;
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
    	
    }
    
    $scope.selectInfoHubsEntry = function(index){
    	entry = $scope.searchResults.infohubs[index];
    	console.log('Search InfoHubs Entry: '+JSON.stringify(entry));

    	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
    	var subcategory = category[$scope.currentSubcategory];
    	subcategory[$scope.selectedEntryIndex] = entry.id;
    	$scope.selectedEntryIndex++;

    }
    
    $scope.entryForIndex = function(index, offset) {
//    	console.log('ENTRY FOR INDEX: '+index+', OFFSET: '+offset);
    	
    	var category = $scope.selectedDevice.configuration[$scope.currentCategory];
    	var subcategory = category[$scope.currentSubcategory];
    	console.log('ENTRY FOR INDEX: '+JSON.stringify(subcategory));

    	var i = calculateEntryIndex(index, offset);
    	var entry = $scope.entriesMap[subcategory[i]];
    	return entry.title;

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

