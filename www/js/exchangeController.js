var exchange = angular.module("exchange", ["chart.js"]);




exchange.controller('MainCtrl',["$scope","$log","$http",
 function ($scope,$log,$http) {
    var socket = io('http://localhost:8081');
    socket.on('news', function (data) {
        if(!data){
          $scope.message("Error no socket connection");
        }
      });

     // {
     // "stockId": [stockPriceObj1,stockPriceObj2,...] ,
     // ...
     //}
     var stock = {}; 
     var stockDetail = {};
    $scope.stockIds = [];

    $http.get("api/stock/all").then(function(result){
      
      $.each(result.data, function(value,key){
        $scope.stockIds.push(key._id);
        stock[key._id] = [];
        stockDetail[key._id] = key;
        initStockPrices();

      })

      socket.on("stockPriceUpdate",function(data){
        console.log("New StockUpdate message: " )
        console.log(data)

        stock[data.stockId].push(data);
        console.log(stock[data.stockId].length)
      })
    })

               
    

    function initStockPrices(){
      $.each(Object.keys(stock),function(value,key){
        $http.get("api/stock/price/"+key+"/quantity/100").then(
          function(result){
            stock[key] = result.data;
          }
        )
      })
    };
    
    
    //Main chart preparation
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };



   
  }]);





