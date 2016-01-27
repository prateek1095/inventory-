var app = angular.module('Inventoryapp',['ngRoute','ngAnimate','ui.bootstrap']);

app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
        when('/',{
            templateUrl:'partials/main.html',
            controller:'MainCtrl'
        }).
        when('/home',{
            templateUrl:'partials/product.html',
            controller:'ProductCtrl'
        }).
        otherwise({
            redirectTo:'/'
        });
}]);



app.controller('MainCtrl', function($scope,$location){
    $scope.go=function(){
        $location.path('/home');
    };
});

app.controller('ProductCtrl', function($scope,$location,$modal,$filter,$http){

    $scope.product={};

    console.log("Hello World from controller");

    var refresh = function(){
        $http.get('/warehouse').success(function(response){
            console.log('I got the requested data');
            $scope.warehouse=response;
            $scope.products={};
        });
    };  
    $scope.changeStatus = function(product,id){
                    
     };

    refresh();

    $scope.cols=[
                    {text:'ID',predicate:'id',sortable:true,dataType:"number"},
                    {text:'Name',predicate:'name',sortable:true},
                    {text:'Price',predicate:'price',sortable:true},
                    {text:'Stock',predicate:'stock',sortable:true},
                    {text:'Packing',predicate:'packing',sortable:true,dataType:"number"},
                    {text:'Description',predicate:'description',sortable:true},
                    {text:'Status',predicate:'status',sortable:true},
                    {text:'Action',predicate:"",sortable:true}                
    ];

    $scope.open=function(p,size){
        var modalInstance = $modal.open({
            templateUrl:'partials/edit.html',
            controller:'EditCtrl',
            size:size,
            resolve: {
                item: function(){
                    return p;
                }
            }
        });
    }

    $scope.deleteProduct=function(id){
        if(confirm("Are you sure to remove the product")){
        $http.delete('/warehouse/' + id).success(function(response){
            refresh();
                });
        }
    };
    
});

app.controller('EditCtrl', function($scope,$modalInstance,item,$http,$route){
    

    $scope.product=angular.copy(item);

    var id = Math.floor((Math.random()*100) + 1)
    console.log(id);
    
    $scope.cancel=function(){
        $modalInstance.dismiss('Close');
    };

        if (item.name==0) {
            $scope.title="Add Product";
            $scope.buttonText="Add new Product";
        }else{
            $scope.title="Edit Product";
            $scope.buttonText="Update Product";
       }

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        
        var newfeed = function(){
            $http.get('/warehouse').success(function(result){
            console.log('I got the newfeed data');
            $scope.warehouse=result;
            $scope.products={};
            });
        }

    $scope.AddProduct=function(product){
            if (product.length>0 ) {
                $http.put('/warehouse/' + id,$scope.product).success(function(response){
                        if(response.status != 'error'){
                            var x = angular.copy(product);
                            x.save='update';
                            $modalInstance.close(x);
                        }else{ 
                            console.log(response);
                        }
                });
            }else{
                product.status = 'In Stock';    
                $http.post('/warehouse',$scope.product).success(function(response){
                       if(response.status != 'error'){
                            var x = angular.copy(product);
                            x.save = 'insert';
                            $modalInstance.close();
                            $route.reload();
                       }else{
                        console.log(response);
                       } 
               });
            } 
    };
    newfeed();
});

app.directive('formelement',function(){
    return{
        restrict:"E",
        transclude:true,
        scope:{
            label:"@",
            model:"="
        },
        link:function(scope,element,attrs){
                scope.disabled = attrs.hasOwnProperty('disabled');
                scope.requied =  attrs.hasOwnProperty('required');
                scope.pattern =  attrs.pattern || '.*'; 
        },
            template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" > {{label}} </label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
    
    };
});

app.directive('onlynum',function(){
    return function(scope,element,attrs){
        
                var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];

                element.bind('keydown', function(event){
                        if($.inArray(event.which,keyCode)== -1){
                            scope.$apply(function(){
                            scope.$eval(attrs.onlyNum);
                            event.preventDefault();
                            });
                            event.preventDefault();
                        }
                });
    };
});

app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }      
});

app.directive('animateOnChange',function($animate){
    return function(scope,element,attrs){
        scope.$watch(attrs.animateOnChange, function(nv,ov) {
            if (nv!=ov) {
                    var c = 'change-up';
                      $animate.addClass(elem,c, function() {
                      $animate.removeClass(elem,c);
                            });
             }
      });  
    };
});

