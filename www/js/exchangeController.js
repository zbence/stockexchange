var exchange = angular.module("exchange", []);




exchange.controller('MainCtrl',["$scope","$log", function ($scope,$log) {
    var socket = io('http://localhost:8081');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
      });
    $scope.$log = $log;
    $scope.message = 'Hello World!';
   
  }]);



