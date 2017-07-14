'use strict'

msApp.service('es', function (esFactory) {
    return esFactory({ host: 'localhost:9200' });
});


msApp.factory('d3service', [function(){
    var d3;
     return d3;
}]);
