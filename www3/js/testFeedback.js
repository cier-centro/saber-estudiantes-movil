cont_angular.controller('feedbackTestCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate) {
        if (selected_questions.length == 0) {
            $state.go("dbasselection");
        }


        $scope.$on('$ionicView.enter', function () {
            $scope.questions = user_answers;
            $scope.infoquestions = questions_data;
            $scope.name = user_name;
        })

        $scope.loadPDFAng = function (file) {
            pdfname = "contents/" + file;
            LoadPDF();
            $ionicScrollDelegate.resize();
        }

        $scope.showQuestion = function (q) {
            if ($scope.modal != null) {
                $scope.modal.remove();
            }
            $scope.questionToDetail = q;
            var template = '<ion-modal-view><ion-header-bar><h4 class="title">Respuesta de pregunta {{questionToDetail.cod_question}}</h4><div class="buttons"><button class="button button-icon ion-close" ng-click="modal.hide()"></button></div></ion-header-bar><ion-content>'
            template += '<h4><p style="margin-left:0.5em">Encabezado:</p></h4>'
            template += '<div class="card">'
            template += '<div class="item item-text-wrap" align="justify">'
            template += '<h2>{{questionToDetail.question.header_question}}</h2>'
            template += '</div>'
            template += '</div>'
            template += '<div class="card">'
            template += '<div class="item item-text-wrap">{{questionToDetail.file}}'
            if ($scope.questionToDetail.question.type == '2') {
                template += '{{questionToDetail.question.file}}'
            } else if ($scope.questionToDetail.question.type == '1') {
                template += '<div>'
                template += '<button id="load" class="button button-balanced" ng-click="loadPDFAng(questionToDetail.question.file)">Cargar lectura</button>'
                template += '<button id="prev" class="button button-balanced" style="display:none">Pagina Anterior</button>'
                template += '<button id="next" class="button button-balanced" style="display:none">Pagina Siguiente</button>'
                template += '<span id="detail" style="display:none">Pagina: <span id="page_num"></span> / <span id="page_count"></span></span>'
                template += '</div>'
                template += '<canvas id="pdf_viewer" class="row" style="height: 800px;display:none"></canvas>'

            } else if ($scope.questionToDetail.question.type == '3') {
                template += '<img src="contents/' + $scope.questionToDetail.question.file + '" class="row">'
            }
            template += '</div>'
            template += '</div>'
            template += '<h4><p style="margin-left:0.5em">Respuestas:</p></h4>'
            template += '<div class="card">'
            template += '<div><div class="row"><div class="col col-25" align="center"><h4>Seleccionada</h4></div><div class="col col-75" align="center"><h4>Respuesta</h4></div></div>'
            template += '<div class="row" ng-repeat="answer in questionToDetail.question.answers track by $index"  >'
            template += '<div class="col col-25" align="center" ng-class="questionToDetail.selected_index==$index ? \'ion-arrow-right-b\':\'SA\'"></div>'
            template += '<div class="col col-75" align="justify" ng-class="answer.is_correct==true ? \'balanced-bg\':\'SA\'">'
            template += '<div class="col col-75" align="justify" ng-class="questionToDetail.selected_index==$index && answer.is_correct==false ? \'assertive-bg\':\'SA\'">'
            //template += '<div class="col col-75" align="justify" ng-class="{true:\'assertive-bg\', false:\'\'}[questionToDetail.selected_index==$index && answer.is_correct==false]">'
            if ($scope.questionToDetail.question.type == 2) {
                template += '{{answer.header_answer}}'
            } else {
                template += '{{answer.header_answer}}'
            }
            template += '</div>'
            template += '</div>'
            template += '</div>'
            template += '</div>'
            template += '<div class="buttons" style="text-align: right;">'
            template += '<p style="margin-right:1em"><button class="button button-assertive" ng-click="modal.hide()">Volver a Resultados</button></p>'
            template += '</div>'
            template += '</ion-content></ion-modal-view>';
            $scope.modal = $ionicModal.fromTemplate(template, {
                scope: $scope
            });
            $scope.modal.show();
            $scope.$on('modal.shown', function () {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });
        }

        $scope.resetvariablesAndGoBack = function () {
            selected_dbas = [];
            max_questions = 0;
            user_name = "";
            questions_data = {};
            selected_questions = [];
            current_question = 0;
            user_answers = {};
            $state.go('dbasselection')
        }
        $scope.savePDF = function () {

            var doc = new jsPDF();
            //var imgData = 'data:image/jpg;base64,' + Base64.encode('images/pruebas.jpeg');
            //doc.addImage(imgData, 'JPEG', 20, 40, 180, 160);
            doc.setFontSize(15);
            doc.text(90, 20, 'Pruebas Saber');
            doc.text(20, 40, 'Nombre: ' + $scope.name);
            doc.text(20, 50, 'Hoja de Resultados: ');
            doc.setFontSize(11);
            doc.setLineWidth(0);
            doc.setTextColor(0, 0, 255);
            doc.line(40, 66, 160, 66);
            doc.text(40, 70, '');
            doc.text(71, 70, 'A.');
            doc.text(96, 70, 'B.');
            doc.text(121, 70, 'C.');
            doc.text(146, 70, 'D.');
            doc.line(40, 71, 160, 71);
            var i = 0;
            //insertar vector de correctas o no de ansuer
            //var is_correct = [0, 1, 0, 1];
            for (var j in $scope.questions) {
                doc.setTextColor(0, 0, 255);
                doc.text(49, 75 + i * 5, (i + 1) + "");
                doc.setTextColor(255, 0, 0);
                for (var k = 0; k < 4; k++) {

                    if ($scope.questions[j].question.answers[k].is_correct * (k + 1) - ($scope.questions[j].selected_index + 1) == 0) {
                        doc.setFillColor(255, 255, 255);
                        doc.rect(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5, 4, -3, 'F');
                        doc.setDrawColor(0, 255, 0);
                        doc.setLineWidth(0.5);
                        doc.line(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5 - 2, 71 + 25 * $scope.questions[j].selected_index + 2, 75 + i * 5);
                        doc.line(71 + 25 * $scope.questions[j].selected_index + 2, 75 + i * 5, 71 + 25 * $scope.questions[j].selected_index + 5, 75 + i * 5 - 5);
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(0);
                        break;
                    }
                    else {
                        doc.setTextColor(255, 0, 0);
                        doc.text(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5, 'X');
                    }
                }
                doc.line(40, 76 + i * 5, 160, 76 + i * 5);
                i++
            }
            doc.line(40, 66, 40, 76 + (i - 1) * 5);
            doc.line(60, 66, 60, 76 + (i - 1) * 5);
            doc.line(85, 66, 85, 76 + (i - 1) * 5);
            doc.line(110, 66, 110, 76 + (i - 1) * 5);
            doc.line(135, 66, 135, 76 + (i - 1) * 5);
            doc.line(160, 66, 160, 76 + (i - 1) * 5);
            //doc.show('Test.pdf');
            var pdfOutput = doc.output();
            console.log( pdfOutput );

            //NEXT SAVE IT TO THE DEVICE'S LOCAL FILE SYSTEM
            console.log("file system...");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

               console.log(fileSystem.name);
               console.log(fileSystem.root.name);
               console.log(fileSystem.root.fullPath);

               fileSystem.root.getFile("test.pdf", {create: true}, function(entry) {
                  var fileEntry = entry;
                  console.log(entry);

                  entry.createWriter(function(writer) {
                     writer.onwrite = function(evt) {
                     console.log("write success");
                  };

                  console.log("writing to file");
                     writer.write( pdfOutput );
                  }, function(error) {
                     console.log(error);
                  });

               }, function(error){
                  console.log(error);
               });
            },
            function(event){
             console.log( evt.target.error.code );
            });


        }
    }])
