
var restService = angular.module('restService', []);

restService.factory('restService', ['$http',
                                    function($http) {
                                              var baseUrl = 'http://800.zuse-infohub.appspot.com';

                                              return {
                                                  getResource: function(resource, id, params) {
                                                	  var endpoint = baseUrl+'/api/'+resource;
                                                	  if (id != null)
                                                		  endpoint = endpoint+'/'+id;
                                                	  
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('GET RESOURCE: '+endpoint);
                                                      return $http.get(endpoint); 
                                                  },

                                                  getEntries: function() {
                                                      return $http.get(baseUrl+'/api/entries?format=map'); //'assets/mockdata/entries.json'); //
                                                  },

                                                  getDevices: function() {
                                                      return $http.get(baseUrl+'/api/devices');
                                                  },

                                                  searchEntries: function(searchTerm, lat, long, fsCategory) {
                                                      return $http.get(baseUrl+'/api/entries?format=map&search=' + searchTerm + '&ll=' + lat + ',' + long + '&foursquarefilter=' + fsCategory);
                                                  }

                                              }
                                          }
                                      ]);