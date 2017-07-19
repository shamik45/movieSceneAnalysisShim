msApp.controller('VisualizeCtrl', function($q,$scope, es) {

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
                "field" : "title.keyword",
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

  $scope.height = 700;
  $scope.width = 500;


  $scope.rotate = function() {
    return ~~(Math.random() * 2) * 90;
  }

  $scope.selectedWord = "";

  //custom rotate

  $scope.wordClicked= function(word){
    //alert(word.text + word.size);

    $scope.selectedWord.text = word.text;
    $scope.selectedWord.size = word.size;
    console.log("word clicked " + word.text + " with size " + word.size);
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
                    "title": choice
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
          //$scope.response = response;
            console.log("processing response")


            for (var loop = 0; loop < (response.aggregations.label.labels.buckets.length); loop++)
            //for (var loop = 0; loop < 3; loop++)
          {
            $scope.labels[loop] = response.aggregations.label.labels.buckets[loop].key;
            $scope.data[loop] = response.aggregations.label.labels.buckets[loop].doc_count;

            var b = new Object();
            b.text = response.aggregations.label.labels.buckets[loop].key;
            b.size = response.aggregations.label.labels.buckets[loop].doc_count;

            $scope.words[loop] = b;

          }

          console.log($scope.words)
        });


  }




});



msApp.controller('SpeechSearchCtrl', function($scope, es){

    this.rec = new webkitSpeechRecognition();
    this.interim = [];
    this.final = '';
    var self = this;

    this.rec.continuous = false;
    this.rec.lang = 'en-US';
    this.rec.interimResults = true;
    this.rec.onerror = function(event) {
        console.log('error!');
    };

    this.start = function() {
        self.rec.start();
    };

    $scope.labels = [];
    $scope.data = [];


    this.rec.onresult = function(event) {
        self.final = "";
        for(var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal) {

                self.final = self.final.concat(event.results[i][0].transcript);
                console.log(event.results[i][0].transcript);
                $scope.$apply();

                es.search(
                    {
                        index: 'movie',
                        size: 0,
                        body: {
                            "aggs": {
                                "label": {
                                    "filter": {
                                        "match": {
                                            "label": self.final
                                        }
                                    },
                                    "aggs": {
                                        "labels": {
                                            "terms": {
                                                "field": "title.keyword",
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
                        //$scope.response = response;
                        console.log("processing response")


                        for (var loop = 0; loop < (response.aggregations.label.labels.buckets.length); loop++)
                            //for (var loop = 0; loop < 3; loop++)
                        {
                            console.log(response.aggregations.label.labels.buckets[loop].key);
                            console.log(response.aggregations.label.labels.buckets[loop].doc_count);

                            $scope.labels[loop] = response.aggregations.label.labels.buckets[loop].key;
                            $scope.data[loop] = response.aggregations.label.labels.buckets[loop].doc_count;

                        }

                        //console.log($scope.words)
                    });


            }
        }
    };

});