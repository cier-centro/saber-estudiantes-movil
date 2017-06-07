angular.module('app.routes', [])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('start', {
                        url: '/start',
                        templateUrl: 'templates/startPage.html',
                        controller: 'startPageCtrl'
                    })
                    .state('upload_questionary', {
                        url: '/uploadQuestionary',
                        templateUrl: 'templates/UploadQuestionary.html',
                        controller: 'uploadQuestionaryCtrl'
                    })
                    .state('create_questionary', {
                        url: '/createQuestionary',
                        templateUrl: 'templates/CreateQuestionary.html',
                        controller: 'createQuestionaryCtrl'
                    })
                    .state('dbasselection', {
                        url: '/selectDbas',
                        templateUrl: 'templates/selectDbas.html',
                        controller: 'constructTestCtrl'
                    })
                    .state('selectQuestions', {
                        url: '/selectQuestions',
						            cache: false,
                        templateUrl: 'templates/selectQuestions.html',
                        controller: 'selectQuestionsCtrl'
                    })
                    .state('askaquestion', {
                        url: '/answerTest',
                        cache: false,
                        templateUrl: 'templates/askQuestion.html',
                        controller: 'askTestCtrl'
                    })
                    .state('answersFeedback', {
                        url: '/answersFeedback',
                        cache: false,
                        templateUrl: 'templates/answersFeedback.html',
                        controller: 'feedbackTestCtrl'
                    })
            $urlRouterProvider.otherwise('/start')
        });
