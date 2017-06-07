angular.module('app.routes', [])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
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
                        templateUrl: 'templates/answersFeedback.html',
                        controller: 'feedbackTestCtrl'
                    })
            $urlRouterProvider.otherwise('/selectDbas')
        });