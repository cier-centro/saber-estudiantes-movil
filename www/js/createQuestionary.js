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

        $scope.randomQuestion = function(dba_set){

          var max = dba_set.length-1;
          var min = 0;
          var index =  Math.floor(Math.random()*(max-min+1)+min);
          var second = dba_set[index];
          var max2 = second["questions"].length-1;
          var min2 = 0;
          var index2 =  Math.floor(Math.random()*(max2-min2+1)+min2);
          return [index,index2]
        }

        $scope.randomTest = function () {
          if($scope.verifyData()){
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
            selected_questions = [];
            selected_dbas=[];
            $scope.dbas = [];
            for (var i = 0; i < inputs.length; i++) {
                selected_dbas.push(inputs[i].id);
            }
						var url = "data/questions.json";
						if(ionic.Platform.isAndroid()){
							url = "/android_asset/www/data/questions.json";
						}
						$http.get(url).success(function(response){
							for (var o in selected_dbas){
								if (response[selected_dbas[o]]){
									$scope.dbas.push(response[selected_dbas[o]])
								}
							}
              console.log($scope.dbas)
              var qset=[];
              var added_q = 0;
              while(added_q<max_questions){
                var n_q= $scope.randomQuestion($scope.dbas)
                var add= true
                for(var e in qset){
                  if(qset[e][0]==n_q[0] && qset[e][1]==n_q[1]){
                    add=false
                  }
                }
                if(add){
                  selected_questions.push($scope.dbas[n_q[0]]["questions"][n_q[1]].id);
                  qset.push(n_q)
                  added_q++;
                }
              }
							shuffle(selected_questions);
							questions_data = $scope.dbas;
              $scope.showNamePopup();
							//$state.go("askaquestion");
            })
          })
        }
        }

        $scope.returnToMain = function(){
          $state.go("start")
        }

        $scope.verifyData=function(){
          var valid=0;
          if(typeof $scope.data.name=="undefined"){
            valid++;
          }
          if(typeof $scope.data.test_name=="undefined"){
            valid++;
          }
          if($scope.data.grade==0){
            valid++;
          }
          if($scope.data.id_asignature=="NA"){
            valid++;
          }
          if(valid>0){
            var alertPopup = $ionicPopup.alert({
                title: 'Datos faltantes',
                template: 'Debe agregar todos sus datos para continuar'
            });
            return false;
          }
          return true;
        }


    }]);
