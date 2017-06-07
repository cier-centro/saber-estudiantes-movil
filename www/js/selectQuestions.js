cont_angular.controller('selectQuestionsCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicModal, $ionicScrollDelegate) {

        if (selected_dbas.length == 0) {
            $state.go("start");
        }

        $scope.dbas = [];
        $scope.data = {"max_questions": max_questions, "numberofquestions": 0}
        $scope.getQuesitonsData = function () {
            $scope.data.max_questions = max_questions;
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
				console.log($scope.dbas)
                questions_data = $scope.dbas;
			});
			/*console.log(selected_dbas)
            $http.post("quiz/get-questions", {"dba_list": selected_dbas}).then(function (r) {
                $scope.dbas = r.data;
                questions_data = r.data;
            });*/
        };

        $scope.$on('$ionicView.enter', function () {
            $scope.getQuesitonsData()
            $scope.data = {"max_questions": max_questions, "numberofquestions": 0}
        });

        $scope.setCounter = function (e) {
            if (e.target.checked && $scope.data.numberofquestions < $scope.data.max_questions) {
                $scope.data.numberofquestions++;
            } else if (!e.target.checked) {
                $scope.data.numberofquestions--;
            } else {
                e.target.checked = false;
            }
        };

        $scope.Return = function () {
            $state.go("dbasselection");
        };

		/*$scope.Print = function () {
			const electron= nodeRequire('electron').remote;
			const fs = nodeRequire('fs');
			let win = electron.BrowserWindow.getFocusedWindow();
			console.log(win)
            win.webContents.printToPDF({
			  landscape: true
			}, function(err, data) {
			  var dist = 'C:\\Users\\jeanpierre\\Desktop\\test.pdf'
			  fs.writeFile(dist, data, function(err) {
				if(err) alert('genearte pdf error', err)
			  })
			})
    };*/

        $scope.showPopup = function () {
            if ($scope.data.numberofquestions == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Seleccione Preguntas',
                    template: 'Debe seleccionar preguntas para poder continuar.'
                });

                alertPopup.then(function (res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
                return null;
            }
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
                                //don't allow the user to close unless he enters wifi password
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

                    var inputs = document.getElementById('question_list').elements;

                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].checked) {
                            selected_questions.push(inputs[i].name)
                        }
                    }

                    shuffle(selected_questions);
                    current_question = 0;

                    for (var i in questions_data) {
                        for (var j in questions_data[i]["questions"]) {

                            var q = questions_data[i]["questions"][j].answers;
                            shuffle(q);
                            questions_data[i]["questions"][j].answers = q;

                        }
                    }

                    max_questions = $scope.data.max_questions;

                    $state.go("askaquestion");
                }
            });
        }

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group))
                $scope.shownGroup = null;
            else
                $scope.shownGroup = group;
        };

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };

        $scope.loadPDFAng = function (file) {
            pdfname = "contents/" + file;
            LoadPDF();
            $ionicScrollDelegate.resize();
        }

        $scope.showDetail = function ($event, question) {
            if ($scope.popover != null) {
                $scope.popover.remove();
            }

            $scope.questionToDetail = question;

            $scope.getLetter = function (index) {
                return String.fromCharCode(65 + index);
            };

            var template = '<ion-modal-view><ion-header-bar><h4 class="title">Pregunta {{questionToDetail.cod_question}}</h4><div class="buttons"><button class="button button-icon ion-close" ng-click="popover.hide()"></button></div></ion-header-bar><ion-content>'

            template += '<h4><p style="margin-left:0.5em">Encabezado:</p></h4>'
            template += '<div class="card">'
            template += '<div class="item item-text-wrap" align="justify">'
            template += '<h2>{{questionToDetail.header_question}}</h2>'
            template += '</div>'
            template += '</div>'
            switch ($scope.questionToDetail.file) {
                case null:
                    break;
                case 'NA':
                    break;
                default:
                    template += '<div class="card">'
                    template += '<div class="item item-text-wrap">'
                    if ($scope.questionToDetail.type == '2') {
                        template += '{{questionToDetail.file}}'
                    } else if ($scope.questionToDetail.type == '1') {
                        template += '<div>'
                        template += '<button id="load" class="button button-balanced" ng-click="loadPDFAng(questionToDetail.file)">Cargar lectura</button>'
                        template += '<button id="prev" class="button button-balanced" style="display:none">Pagina Anterior</button>'
                        template += '<button id="next" class="button button-balanced" style="display:none">Pagina Siguiente</button>'
                        template += '<span id="detail" style="display:none">Pagina: <span id="page_num"></span> / <span id="page_count"></span></span>'
                        template += '</div>'
                        template += '<canvas id="pdf_viewer" class="row" style="height: 800px;display:none"></canvas>'

                    } else if ($scope.questionToDetail.type == '3') {
                        template += '<img src="contents/' + $scope.questionToDetail.file + '" class="row">'
                    }
                    template += '</div>'
                    template += '</div>'
            }

            template += '<h4><p style="margin-left:0.5em">Respuestas:</p></h4>'
            template += '<div class="card">'
            template += '<div ng-repeat="answer in questionToDetail.answers" class="item item-text-wrap" align="justify">'
            template += '<b>({{getLetter($index)}}).</b> {{answer.header_answer}}'
            template += '</div>'
            template += '</div>'
            template += '<div class="buttons" style="text-align: right;">'
            template += '<p style="margin-right:1em"><button class="button button-assertive" ng-click="popover.hide()">Cancelar</button></p>'
            template += '</div>'
            template += '</ion-content></ion-modal-view>';
            $scope.popover = $ionicModal.fromTemplate(template, {
                scope: $scope,
            });
            $scope.popover.show($event);
            $scope.$on('modal.shown', function () {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });

            //alert("llego")
        };

    }]);
