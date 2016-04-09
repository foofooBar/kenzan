'use strict';

angular.module('myApp.customer', ['ngRoute', 'ngTable', 'ngDialog'])


.controller('CustomerCtrl', ['$scope', '$http', 'ngTableParams', 'ngDialog', function($scope, $http, NgTableParams, ngDialog) {

  $scope.welcomeTag = "Kenzan Customer Maintenance App";
  $scope.customerArray = [];
  $scope.errorMessage = undefined;

  $scope.tableParams = new NgTableParams({ page: 1 });

  $scope.getAllCustomers = function() {

	  $http.get('http://localhost:8080/KenzanCustomerProject/api/CustomerService/customers/')
	    .success(function (data, status, headers, config) {
	        $scope.customerArray = data;

	    })
	    .error(function (data, status, header, config) {
	    	if (data === []) {
	    		//no records found
	    		$scope.errorMessage=  "No customer exists at this time. Please use 'Add customer button to add customers";
	    	} else {
	    		$scope.errorMessage = "Error happended in getting a list of all customers. Please try again later.";
	    	}
	        
	    });
  };

  $scope.getAllCustomers();


  $scope.openEditDialog = function(action, customer) {
  	var newScope = $scope.$new();
  	if (customer === undefined) {
  		customer = {address: {}};
  	}
  	newScope.currentCustomer = customer;
  	newScope.pristineCustomer =  { address: {}};
  	$scope.copyObject(newScope.pristineCustomer, newScope.currentCustomer);
  	newScope.action = action;

  	newScope.httpMethod = "PUT";
  	newScope.httpUrl = "http://localhost:8080/KenzanCustomerProject/api/CustomerService/customers/add";
  	newScope.readonly = false;
  	
  	
  	if (action === 'Delete') {
  		newScope.readonly = true;
  		newScope.httpMethod = "DELETE";
  		newScope.httpUrl = "http://localhost:8080/KenzanCustomerProject/api/CustomerService/customers/delete";
  	} 
  	if (action === "Edit") {
  		newScope.httpMethod = "POST";
  		newScope.httpUrl = "http://localhost:8080/KenzanCustomerProject/api/CustomerService/customers/update";
  	}
  	
  	ngDialog.openConfirm({ 
  		template: 'actionTemplate', 
  		scope : newScope 
  	}).then(
			function(value) {
				//save changes customer form
				$scope.saveUserChanges(newScope);
   			},
			function(value) {
				//reset model if changes were made in edit mode
				if (newScope.action === 'Edit') {
					$scope.copyObject(newScope.currentCustomer, newScope.pristineCustomer);
				}
			}
		);
  }


  $scope.copyObject =  function (toCustomer, fromCustomer){
  	toCustomer.name = fromCustomer.name;
  	toCustomer.telephone = fromCustomer.telephone;
  	toCustomer.email = fromCustomer.email;
  	toCustomer.address.street = fromCustomer.address.street;
  	toCustomer.address.city = fromCustomer.address.city;
  	toCustomer.address.state = fromCustomer.address.state;
  	toCustomer.address.zip = fromCustomer.address.zip;
  }

  $scope.saveUserChanges = function(config) {

  	$http({
		          method  : config.httpMethod,
		          url     : config.httpUrl,
		          data    : config.currentCustomer,
		          headers : {'Content-Type': 'application/json', 'Accept': 'application/json'} 
		         }).success(function(data) {
		            if (data.errorMessages) {		              
		              $scope.errorMessage = data.errorMessages;
		            } else {
		            	if (data.errorMessages) {
		            		$scope.errorMessage = data.errorMessages;
		            	}
		              //update list
		              $scope.getAllCustomers();
		            }
          		}).error(function(data, status, headers, config) {
		         	if (data.errorMessages) {
		            	$scope.errorMessage = data.errorMessages;
		            }
    			});
  }

}]);