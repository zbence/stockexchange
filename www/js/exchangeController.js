var exchange = angular.module("exchange", ["chart.js"]);


var stockPriceCount = 10;

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
    $scope.inspected = {};
    $scope.lastPrices = {};

   $http.get("api/stock/all").then(function(result){
      
      $.each(result.data, function(value,key){
        $scope.stockIds.push(key._id);
        $scope.stockIds = $scope.stockIds.sort();
        stock[key._id] = [];
        stockDetail[key._id] = key;
        initStockPrices();

      })

      socket.on("stockPriceUpdate",function(data){
        updateLastPrice(data)
        stock[data.stockId].push(data);
        console.log(stock[data.stockId].length)
        if(data.stockId == $scope.selectedStockPrice) {
          $scope.onStockChange();
          $scope.$apply();
        }
      })
    })

               
    

    function initStockPrices(){
      $scope.selectedStockPrice = $scope.stockIds[0];
      $.each(Object.keys(stock),function(value,key){
        $http.get("api/stock/price/"+key+"/quantity/100").then(
          function(result){
            stock[key] = result.data;
          }
        )
      })
    };
    
    
    $scope.onStockChange = function (){
      
       if(!$scope.selectedStockPrice){
         console.log("selectedStockPrice is null");
         return
       }
       $scope.selectedStockPriceCategory = stockDetail[$scope.selectedStockPrice].category;

       var prices = [];
       var timestamps  = [];

       $.each(stock[$scope.selectedStockPrice].slice(-stockPriceCount),function(index,element){

        prices.push(element.price);
        timestamps.push(element.timestamp);
      })

      $scope.labels =timestamps;
     
       $scope.data =prices;
     
       
    }
    
    //Main chart preparation
    $scope.labels = ["ddfd"];
  $scope.series = ["dfdf"];
  $scope.data = [1,2];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        xAxes: [{
            type: 'time',
            time: {
                displayFormats: {
                    quarter: 'MMM YYYY'
                },
                
            }
        }],
      },
    
    };


    function updateLastPrice(priceObj) {

      priceObj.price =  parseFloat(priceObj.price).toFixed(2);
      if(!$scope.lastPrices[priceObj.stockId]){
        $scope.lastPrices[priceObj.stockId] = priceObj;
        $scope.lastPrices[priceObj.stockId].change = 0;
      }else {
        $scope.lastPrices[priceObj.stockId].change = parseFloat((priceObj.price - $scope.lastPrices[priceObj.stockId].price) /$scope.lastPrices[priceObj.stockId].price  *100).toFixed(2);
        $scope.lastPrices[priceObj.stockId].price = parseFloat(priceObj.price).toFixed(2);
      }

   }

   
  }]);





