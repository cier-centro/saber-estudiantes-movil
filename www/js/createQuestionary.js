cont_angular.controller('createQuestionaryCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup','$interval','globals',
    function ($scope, $stateParams, $http, $state, $ionicPopup, $interval,globals) {
        $scope.data = {"grade": "0", "id_asignature": "NA", max_questions: "5", option: "manual", name:""};
        $scope.dbas = [];
        $scope.showNamePopup =function(){
              globals.total_time = 0;
              timer = setInterval(function(){
                  globals.total_time++;
                  $scope.$apply();
                  document.getElementById("time_counter").innerHTML = "Tiempo Total: " + Math.floor(globals.total_time/60)+":"+Math.floor(globals.total_time%60);
                  console.log(globals.total_time);
              }, 1000);
              user_name=$scope.data.name;
              $state.go("askaquestion");
        }

        $scope.randomTest = function () {
          var url = "data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
					if(ionic.Platform.isAndroid()){
						url = "/android_asset/www/data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
					}

					$http.get(url).success(function(response){
						var inputs = response;
            max_questions = $scope.data.max_questions;
            user_name = $scope.data.student_name;
            test_name = $scope.data.test_name;
            selected_level=  $scope.data.grade;
            selected_asignare = $scope.data.id_asignature;
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
              $scope.showNamePopup();
							//$state.go("askaquestion");
            })
          })
        }

        $scope.returnToMain = function(){
          $state.go("start")
        }


    }]);
