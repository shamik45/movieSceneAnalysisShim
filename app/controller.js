msApp.controller('VisualizeCtrl', function($q,$scope, es, $window) {

  $scope.mediaIdList = [];
  //get list of all media
  es.search(
      {
        index: 'movie',
        size: 0,
        body:{
          "aggs" : {
            "medias" : {
              "terms" : {
                "field" : "id.keyword",
                "size" : 2000
              }
            }
          }


        }
      }
  ).then
  (function(response){
     $scope.mediaresponse = response;

    for(var mediaLoop=0; mediaLoop < response.aggregations.medias.buckets.length; mediaLoop++){
      $scope.mediaIdList[mediaLoop] = response.aggregations.medias.buckets[mediaLoop].key;
    }
  });

  $scope.words = [];
  var self = this;
  self.height = $window.innerHeight * 0.5;
  self.width = $window.innerWidth * 0.5

  $scope.words = [
    {text: 'Angular',size: 25,color: '#0e6632'},
    {text: 'Angular2',size: 35,color: '#0e558'}
  ]
  console.log(self.height);
  console.log(self.width);

  function rotate(){
    return ~~(Math.random() * 2) * 90;
  }

  //custom rotate
  function wordClicked(word){
    alert(word);
  }


  $scope.setCurrentMedia = function(choice)
  {

    $scope.currentChoice = choice;
    var stArray = choice.split('/');
    console.log("only id is " + stArray[stArray.length -1 ])
    $scope.labels = [];
    $scope.data = [];

    es.search(
        {
          index: 'movie',
          size: 0,
          body: {
            "aggs": {
              "label": {
                "filter": {
                  "match": {
                    "id": stArray[stArray.length -1 ]
                  }
                },
                "aggs": {
                  "labels": {
                    "terms": {
                      "field": "label.keyword",
                      "size" : 25
                    }

                  }
                }

              }
            }
          }

        }
    ).then(
        function (response)
        {
          $scope.response = response;

          for (var loop = 0; loop < response.aggregations.label.labels.buckets.length; loop++)
          {
            $scope.labels[loop] = response.aggregations.label.labels.buckets[loop].key;
            $scope.data[loop] = response.aggregations.label.labels.buckets[loop].doc_count;

            var b = new Object();
            b.text = response.aggregations.label.labels.buckets[loop].key;
            b.size = response.aggregations.label.labels.buckets[loop].doc_count;
            //b.color = '#0e558';

            $scope.words[loop] = b;

            /*$scope.words[loop].text =response.aggregations.label.labels.buckets[loop].key;
            $scope.words[loop].size =response.aggregations.label.labels.buckets[loop].doc_count;
            $scope.words[loop].color = '#0e558';
            */
          }
        });


  }




});
