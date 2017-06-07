cont_angular.controller('uploadQuestionaryCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicScrollDelegate','$http','globals',"$fileFactory","$ionicModal",
    function ($scope, $stateParams, $ionicPopup, $state, $ionicScrollDelegate,$http,globals,$fileFactory,$ionicModal) {
        $scope.data = {"path":"file:///storage/sdcard/Download/prueba1.prueba","name":""};
        $scope.findfile = function(){
          $scope.loadPopover();
          /*const electron= nodeRequire('electron').remote;
    			const dialog = electron.dialog;
          dialog.showOpenDialog({filters:[{name: 'Prueba tipo saber', extensions: ['prueba']}]}, function (fileNames) {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            $scope.data.path = fileName;
            $scope.$apply()
            //console.log($scope.data.path)
          });
          //document.getElementById("filepathInput").value = $scope.data.path*/
        };


        $scope.preguntasArchivo = []
        $scope.loadFile=function(){

          $scope.name_popup = $ionicPopup.show({
              template: '<p>Por favor, antes de iniciar la prueba ingresa tu nombre</p><input type="text" ng-model="data.name">',
              title: 'Ingresa tu nombre',
              subTitle: '',
              scope: $scope,
              buttons: [
                  {
                      text: 'Cancelar',
                      onTap: function (e) {
                          $scope.name_popup.close();
                          return null;
                      }
                  },
                  {
                      text: '<b>Continuar</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.name) {
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                          } else {
                              return $scope.data.name;
                          }
                      }
                  }
              ]
          });

          $scope.name_popup.then(function (res) {
              if (res != null) {
                  user_name = res;
                  $http.get($scope.data.path).success(function(data){
                    console.log("asdasdasddsaasddsasdasadddddddddddddddddddddddddddddddddddddddddddddddddd");
                    lines = data.split('\n');
                    test_name = lines[0];
                    selected_questions = lines[1].split(',')
                    max_questions = selected_questions.length;
                    var sample = selected_questions[0].split('#')[0];
                    selected_level = parseInt(sample)
                    selected_asignare = sample.replace(""+selected_level,"")[0]
                    $scope.getQuesitonsData()
                    timer = setInterval(function(){
                        globals.total_time++;
                        document.getElementById("time_counter").innerHTML = "Tiempo Total: " + Math.floor(globals.total_time/60)+":"+(globals.total_time%60);
                        console.log(globals.total_time);
                    }, 1000);

                    $state.go("askaquestion")
                  });
              }
          });

          /*fileChooser.open(function(uri){
            console.log(uri)
          });*/
          /*var fs = nodeRequire('fs');
          fs.readFile($scope.data.path, 'utf8', function (err, data) {
            if (err) return console.log(err);
            lines = data.split('\n');
            var nombreprueba = lines[0];
            selected_questions = lines[1].split(',')
            max_questions = selected_questions.length;
            var sample = selected_questions[0].split('#')[0];
            selected_level = parseInt(sample)
            selected_asignare = sample.replace(""+selected_level,"")[0]
            $scope.getQuesitonsData()
            timer = setInterval(function(){
                globals.total_time++;
                document.getElementById("time_counter").innerHTML = "Tiempo Total: " + Math.floor(globals.total_time/60)+":"+(globals.total_time%60);
                console.log(globals.total_time);
            }, 1000);
            $state.go("askaquestion")
            // data is the contents of the text file we just read
          });*/
        }

        $scope.getQuesitonsData = function () {
            $scope.data.max_questions = max_questions;
      			var url = "data/questions.json";
      			if(ionic.Platform.isAndroid()){
      				url = "/android_asset/www/data/questions.json";
      			}
      			$http.get(url).success(function(response){
              for (var file_question in selected_questions){
                var quest = selected_questions[file_question];
                var dba = quest.split("#")[0];
                if (questions_data[dba] == undefined){
                  questions_data[dba] = {"code":dba,"questions":[]}
                }
                dba_questions = response[dba].questions
                for (var db_question in dba_questions){
                    if(dba_questions[db_question].cod_question==quest){
                      questions_data[dba].questions.push(dba_questions[db_question]);
                      console.log(questions_data);
                    }
                }
              }
      			});
        };

        $scope.cancel=function(){
          $state.go("start")
        }

        var fs = new $fileFactory();

        $ionicModal.fromTemplateUrl('templates/fileModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
         }).then(function(modal) {
            $scope.filemodal = modal;
         });


        $scope.loadPopover=function(){
          $scope.filemodal.show();
          var permissions = cordova.plugins.permissions;
          permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
            if ( !status.hasPermission ) {
              permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, null, null);
            }
          },null);
          fs.getEntriesAtRoot().then(function(result) {
              $scope.files = result;
          }, function(error) {
              console.error(error);
          });
        }

        $scope.getContents = function(path) {
            if(path.indexOf(".prueba")>-1){
              $scope.filemodal.hide();
              $scope.data.path = path;
            }else{
              fs.getEntries(path).then(function(result) {
                  $scope.files = result;
                  $scope.files.unshift({name: "[parent]"});
                  fs.getParentDirectory(path).then(function(result) {
                      result.name = "[parent]";
                      $scope.files[0] = result;
                  });
              });
            }
        }

    }]);
