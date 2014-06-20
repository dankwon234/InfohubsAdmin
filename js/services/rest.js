
var restService = angular.module('restService', []);

restService.factory('restService', ['$http',
                                    function($http) {
                                              var baseUrl = 'http://806.zuse-infohub.appspot.com';

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
                                                  
                                                  postResource: function(resource, object, params) {
                                                	  var endpoint = baseUrl+'/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('POST RESOURCE: '+endpoint);
                                                	  
                                                      var json = JSON.stringify(object);
                                                      return $http.post(endpoint, json); 
                                                  },

                                                  
                                                  

                                                  putResource: function(resource, object, params) {
                                                	  var endpoint = baseUrl+'/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                            		  endpoint = endpoint+'/'+object.id; // PUTs can only be called on specific entities
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('PUT RESOURCE: '+endpoint);
                                                	  
                                                      var json = JSON.stringify(object);
                                                      return $http.put(endpoint, json); 
                                                  },

                                                  
                                                  deleteResource: function(resource, object, params) {
                                                	  var endpoint = baseUrl+'/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                            		  endpoint = endpoint+'/'+object.id; // DELETEs can only be called on specific entities
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('DELETE RESOURCE: '+endpoint);
//                                                      var json = JSON.stringify(object);
                                                      
                                                      return $http.delete(endpoint); 
                                                  },


                                                  searchEntries: function(searchTerm, lat, long, fsCategory) {
                                                      return $http.get(baseUrl+'/api/entries?format=map&search=' + searchTerm + '&ll=' + lat + ',' + long + '&foursquarefilter=' + fsCategory);
                                                  }

                                              }
                                          }
                                      ]);