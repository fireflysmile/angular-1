'use strict';
/**
 * John Hancock - Ctrl
 ********************************/
angular.module('controllers', [])
.controller('masterCtrl', ['$scope', 'DataService', '$location', 'filterFilter', '$rootScope', '$cookieStore', '$timeout',
    function($scope, DataService, $location, filterFilter, $rootScope, $cookieStore, $timeout) {

        // data json
        var dataPromise = DataService.query('Home');
            dataPromise.then(function(data) {
                $scope.Home = data;
                $scope.dataSet = data.listMail;
            }, function(data) {});

        // active path
            $scope.pathLink = function(route) {
                return route == $location.path();
            };
        // end active path

        // mock up login
            $scope.errorLog = false;
            $scope.login = function () {
                if($scope.username == 'member' && $scope.password == 'member') {                
                    $location.path('/Home');
                }else $scope.errorLog = true;
            }
        // end mock up login


        // show popup note
        $scope.note = function(){
            $scope.showNote = true;
            $timeout(function () {
                $scope.showNote = false;
            }, 5000);
        }

    }
])
.controller('navCtrl', ['$scope','$location', function($scope, $location) {
        // active path
        $scope.pathLink = function(route) {
            return route == $location.path();
        };
        // end active path
    }
]).filter('highlight', function($sce) {
    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')

        return $sce.trustAsHtml(text)
    }
});