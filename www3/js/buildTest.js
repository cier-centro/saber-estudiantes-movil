cont_angular.controller('constructTestCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup',
    function ($scope, $stateParams, $http, $state, $ionicPopup) {
        $scope.data = {"grade": "0", "id_asignature": "NA", max_questions: "5", option: "manual"};

        $scope.getDbaData = function () {
            if ($scope.data.option == "manual") {
				//console.log($scope.data)
				var url = "data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
				if(ionic.Platform.isAndroid()){
					url = "/android_asset/www/data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
				}

				$http.get(url).success(function(response){ 
					//console.log(response)
					$scope.dbas = response;
				});

                /*$http.post("dbas/", $scope.data).then(function (r) {
                    $scope.dbas = r.data;
                });*/
            }
        };

        $scope.$on('$ionicView.enter', function () {
            selected_dbas = [];
        });

        $scope.save_questionary = function () {
            if ($scope.data.option == "manual") {
                var inputs = document.getElementById('dba_list').elements;
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].checked) {
                        selected_dbas.push(inputs[i].name)
                    }
                }
                
                if (selected_dbas.length == 1) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Seleccione dbas',
                        template: 'Debe seleccionar dbas para poder continuar.'
                    });
                    return null;
                }
                max_questions = $scope.data.max_questions;
                $state.go("selectQuestions");
            } else
                $scope.showPopupName();
        };

        $scope.clearDbaList = function () {
            $scope.dbas = [];
        };

        $scope.showPopupName = function () {
            var name_popup = $ionicPopup.show({
                template: '<p>Por favor, antes de iniciar la prueba ingresa tu nombre</p><input type="text" ng-model="data.name">',
                title: 'Ingresa tu nombre',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        onTap: function (e) {
                            name_popup.close();
                            return null;
                        }
                    },
                    {
                        text: '<b>Continuar</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.name) {
                                e.preventDefault();
                            } else {
                                return $scope.data.name;
                            }
                        }
                    }
                ]
            });

            name_popup.then(function (res) {
                if (res != null) {
                    user_name = res;
					var url = "data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
					if(ionic.Platform.isAndroid()){
						url = "/android_asset/www/data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
					}

					$http.get(url).success(function(response){ 
						var inputs = response;
                        max_questions = $scope.data.max_questions;
                        for (var i = 0; i < inputs.length; i++) {
                            selected_dbas.push(inputs[i].id);
                        }
						var url = "data/questions.json";
						if(ionic.Platform.isAndroid()){
							url = "/android_asset/www/data/questions.json";
						}
						$http.get(url).success(function(response){ 
							console.log(selected_dbas)
							console.log(response)
							for (var o in selected_dbas){
								console.log(o)
								if (response[selected_dbas[o]]){
									$scope.dbas.push(response[selected_dbas[o]])
								}
							}
							for (var i in $scope.dbas) {
                                for (var j in $scope.dbas[i]["questions"]) {
                                    if (selected_questions.length < max_questions) {
                                        if (Math.random() > 0.5) {
                                            selected_questions.push($scope.dbas[i]["questions"][j].id);
                                        }
                                    }
                                }
                            }
							shuffle(selected_questions);
							questions_data = $scope.dbas;
							$state.go("askaquestion");
						});
					});

					
		                      

                        /*$http.post("quiz/get-questions", {"dba_list": selected_dbas}).then(function (r) {
                            questions_data = r.data;
                            
                            for (var i in questions_data) {
                                for (var j in questions_data[i]["questions"]) {
                                    if (selected_questions.length < max_questions) {
                                        if (Math.random() > 0.5) {
                                            selected_questions.push(questions_data[i]["questions"][j].id);
                                        }
                                    }
                                }
                            }
                            $state.go("askaquestion");
                        });*/
                    
                }
            });
        }
    }]);