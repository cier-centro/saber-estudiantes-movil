cont_angular.controller('feedbackTestCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate','globals',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate,globals) {
        if (selected_questions.length == 0) {
            $state.go("start");
        }


        $scope.header_data ={"filename":"","test":test_name,"student":user_name,"asignature":selected_asignare,"level":selected_level,"total_time":globals.total_time,"max_questions":max_questions}


        $scope.$on('$ionicView.enter', function () {
            $scope.questions = user_answers;
            $scope.infoquestions = questions_data;
            $scope.name = user_name;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        })

        $scope.loadPDFAng = function (file,group) {
            document.getElementById("pdf_viewer_"+group).style.display="block"
            document.getElementById("btn_canvas_"+group).style.display="none"
            loadFirstPagePDF("contents/"+file,"pdf_viewer_"+group);
            $ionicScrollDelegate.resize();
        }

        $scope.formatTime = function (value) {
            return Math.floor(value/60)+":"+(value%60);
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
            test_name = ""
            selected_level= 0;
            selected_asignare = "Y";
            $state.go('start');
        };

        $scope.showFileName=function(){
          $scope.name_popup = $ionicPopup.show({
            template: '<p>Por favor ingrese el nombre del archivo</p><input type="text" ng-model="header_data.filename">',
            title: 'Nombre del archivo',
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
                  if (!$scope.header_data.filename) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.header_data.filename;
                  }
                }
              }
            ]
          });

          $scope.name_popup.then(function (res) {
              if (res != null) {
                  $scope.savePDF();
              }
          });

        }

        $scope.savePDF = function () {
            var htmlTemplate = angular.element('<html>')
            htmlTemplate.html('<head><meta charset="UTF-8"></head>')
            var body = angular.element("<body>")
            htmlTemplate.append(body)

            for (var j in $scope.questions) {
              var que = $scope.questions[j].question
              var div = angular.element("<div>")
              body.append("<p>"+que.header_question+ "</p>")
              var imgData = "";
              if (que.type==3){
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = document.getElementById('ImgContainer_'+j);
                if(img.complete && img.naturalHeight){
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  context.drawImage(img, 0, 0 );
                }
                imgData = canvas.toDataURL("image/png");
                var tempimg= new Image();
                tempimg.src = imgData
                div.append(tempimg)
              }
              if (que.type==1){
                var canvas = document.getElementById('pdf_viewer_'+j);
                imgData = canvas.toDataURL("image/png");
                var tempimg= new Image();
                tempimg.src = imgData
                div.append(tempimg)
              }
              if (que.type==2){
                var svg = document.querySelector('#mathContainer_'+j+" svg");
                div.append(svg)
                /*var xml = new XMLSerializer().serializeToString(svg);
                console.log("*****" + xml.length);
                var canvas = document.getElementById('temporal');
                canvas.width = 500;
                canvas.height = 500;
                canvg("temporal",  xml);
                imgData = canvas.toDataURL("image/png");*/
              }
              /*var tempimg= new Image();
              tempimg.src = imgData
              div.append(tempimg)*/
              for (var ans in que.answers){
                console.log(que.answers[ans])
                console.log(que.selected_index)
                if($scope.questions[j].selected_index==ans || que.answers[ans].is_correct){
                    var answer = angular.element("<div>");
                    var mark = angular.element("<span>");
                    if (que.answers[ans].is_correct){
                        mark.append("Correcto")
                    }else{
                        mark.append("Incorrecto")
                    }
                    answer.append(mark)
                    if (que.type==2){
                      var svg = document.querySelector('#question_'+j+'_answer_'+ans+' svg');
                      /*var xml = new XMLSerializer().serializeToString(svg);
                      console.log("*****" + xml.length);
                      var canvas = document.getElementById('temporal');
                      canvas.width = 500;
                      canvas.height = 500;
                      canvg("temporal",  xml);
                      imgData = canvas.toDataURL("image/png");
                      var tempimg2= new Image();
                      tempimg2.src = imgData*/
                      answer.append(svg)
                    }else{
                      answer.append(que.answers[ans].header_answer)
                    }
                    div.append(answer)
                }
              }

              body.append(div)
            }
            //document.body.innerHTML = htmlTemplate.html();
            //alert(htmlTemplate.html())
            //doc.save('resultado.pdf');
            var pdfOutput = htmlTemplate.html();
            console.log("file system...");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

               console.log(fileSystem.name);
               console.log(fileSystem.root.name);
               console.log(fileSystem.root.fullPath);

               fileSystem.root.getFile($scope.header_data.filename+".html", {create: true}, function(entry) {
                  var fileEntry = entry;
                  console.log(JSON.stringify(entry));

                  entry.createWriter(function(writer) {
                     writer.onwrite = function(evt) {
                    console.log(JSON.stringify(evt));
                     console.log("write success");
                     window.open(entry.nativeURL)
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


        /*$scope.Print = function () {
    			const electron= nodeRequire('electron').remote;
    			const fs = nodeRequire('fs');
          const dialog = electron.dialog;
          dialog.showSaveDialog({filters:[{name: 'Resultado prueba tipo saber', extensions: ['pdf']}]}, function (fileNames) {
            if (fileNames === undefined) return;
            let win = electron.BrowserWindow.getFocusedWindow();
      			console.log(win)
            win.webContents.printToPDF({
  		           landscape: false
  		      }, function(err, data) {
              var dist = fileNames;
              console.log(dist)
              fs.writeFile(dist, data, function(err) {
                if(err) alert('genearte pdf error', err)
              })
            })
          });

        };*/
    }])
