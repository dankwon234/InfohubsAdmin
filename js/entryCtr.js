var app = angular.module('Entry', []);

app.controller("EntryController", function($scope, $http){
	$scope.loading = false;
		
	// Venue Search Stuff:
	$scope.searchEntry = '';
	$scope.searchResults = { 'infohubs':new Array(), 'foursquare':new Array() };
	$scope.entriesMap = {};

	$scope.primaryURL = '';
	$scope.buttonURL = '';
	$scope.buttonText = '';
	$scope.logoURL = '';
	$scope.backgroundImgURL = '';
	
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
    	
    	//Dan's code to continue without LL throws error
    	latLong = '40.76528,-73.97898';

        var url = '/api/entries?search='+$scope.searchEntry+'&ll='+latLong;
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
    	entry = $scope.searchResults.infohubs[index];
    	console.log('Search InfoHubs Entry: '+JSON.stringify(entry));
		
		$scope.primaryURL = entry.url;
		$scope.buttonURL = entry.secondaryUrls['Menu'];
		$scope.buttonText = 'Menu';
		$scope.logoURL = entry.logo;
		$scope.backgroundImgURL = entry.backgroundImage;
		
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

