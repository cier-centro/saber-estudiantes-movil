cont_angular.controller('feedbackTestCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate','globals',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate,globals) {
        if (selected_questions.length == 0) {
            $state.go("start");
        }


        $scope.header_data ={"filename":"","test":test_name,"filename":test_name,"student":user_name,"asignature":selected_asignare,"level":selected_level,"total_time":globals.total_time,"max_questions":max_questions}


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

        $scope.processQuestion = function (q2,index, writer){
            var q = q2.question
            var html = ""
            if(!q.file) q.file=""
            html+=""+"<p> ("+q.cod_question+")"+ q.header_question+ "</p><div>"

            var imgData = "";
            if (q.file.match(".jpg$") || q.file.match(".png$")){
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              var img = document.getElementById('ImgContainer_'+index);
              if(img.complete && img.naturalHeight){
                canvas.width = 595;
                var new_height = 595/img.naturalWidth*img.naturalHeight;
                canvas.height = new_height;
                context.drawImage(img, 0, 0, 595, new_height);
              }
              imgData = canvas.toDataURL("image/png");
              html+="<img src='"+imgData+"'>"
            }
            if (q.file.match(".pdf$")){
              var canvas = document.getElementById('pdf_viewer_'+index);
              var newcanvas = document.createElement('canvas');
              var context = newcanvas.getContext('2d');
              var new_height = 595/canvas.width*canvas.height;
              newcanvas.width = 595;
              newcanvas.height = new_height;
              context.drawImage(canvas, 0, 0, 595,new_height);
              imgData = newcanvas.toDataURL("image/png");
              html+="<img src='"+imgData+"'>"
            }
            if (!q.file.match(".pdf$") && !(q.file.match(".jpg$") || q.file.match(".png$"))){
              var svg = document.querySelector('#mathContainer_'+index+" svg");
              var ser = new XMLSerializer()
              html+=ser.serializeToString(svg)
            }
            for (var ans in q.answers){
              console.log();
              if(q2.selected_index==ans || q.answers[ans].is_correct){
                html+="<div>"
                html+="<span>"
                if (q.answers[ans].is_correct){
                    html+="Correcto"
                }else{
                    html+="Incorrecto"
                }
                html+="</span>"

                if (q.answers[ans].header_answer.match(".jpg$") || q.answers[ans].header_answer.match(".png$")){
                  var canvas = document.createElement('canvas');
                  var context = canvas.getContext('2d');
                  var img = document.querySelector('#question_'+index+'_answer_'+ans+' img');
                  if(img.complete && img.naturalHeight){
                    canvas.width = 595;
                    var new_height = 595/img.naturalWidth*img.naturalHeight;
                    canvas.height = new_height;
                    context.drawImage(img, 0, 0, 595, new_height);
                  }
                  imgData = canvas.toDataURL("image/png");
                  html+="<img src='"+imgData+"'>"
                }else{
                  var svg = document.querySelector('#question_'+index+'_answer_'+ans+' svg');
                  if(svg!= null){
                    var ser = new XMLSerializer()
                    html+=ser.serializeToString(svg)
                  }else{
                    html+=q.answers[ans].header_answer
                  }
                }
                html+="</div>"
              }
            }
            return html+"</div>"
        }


        $scope.savePDF = function () {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile($scope.header_data.filename+".html", {create: true}, function(entry) {
              $scope.fileEntry = entry;
              entry.createWriter(function(writer) {
                var i=0
                var end = true;
                writer.onwriteend  = function(evt) {
                  if(i<Object.keys($scope.questions).length){
                    writer.write($scope.processQuestion($scope.questions[i],i,writer));
                    console.log(i)
                    i++
                  }else{
                    if(end){
                      writer.write("</body></html>")
                      end=false
                    }
                  }
                };
                writer.write('<html><head><meta charset="UTF-8"><style>div{border:2px solid rgb(100,100,100);margin:20px;max-width:95%}span{margin-right:2%;border-bottom:2px solid rgb(100,100,100);background-color:rgb(230,230,230);padding:10px;width:100%;display:block}img{margin:10px 10% 10px 10%;max-width:80%}svg{margin:10px 10% 10px 10%}p{border-bottom:3px solid rgb(100, 100, 100);border-top:3px solid rgb(100, 100, 100);background-color:rgba(200, 200, 200, 1);width:100%}div.respuesta{border:none !important;margin:10px 10% 10px 10%}</style></head><body>');
              }, function(error) {
                console.log("no se pudo crear el escritor de archivos");
              });

            }, function(error){
              console.log("no se pudo crear/obtener archivo");
            });
          },
          function(event){
            console.log("no se pudo acceder al fileSystem");
          });

        }

    }])
