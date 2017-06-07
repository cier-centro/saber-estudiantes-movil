var selected_dbas = [];
var max_questions = 0;
var user_name = "";
var questions_data = {};
var selected_questions = [];
var current_question = 0;
var user_answers = {};

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

var cont_angular = angular.module('app.controllers', [])
