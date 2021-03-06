(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// The Oktokat Package variables
var Octokat, octo;

// The user to querry variables.
var client_submitted_user_to_querry = "";
var default_user_to_querry = "KoreaHaos";

// The waiting loop variables.
var count = 0;
var max_count = 6;
var signal;

// The Browser Display Variables (Not completed!) // ToDo
var main_heading_string = "GitHub API access.";
var intro_string = "An example of API access.";
var repo_list_string = "REPO LIST";

// The zen button variable.
var gitzen;

// The API rate variables.
var API_count;

// The repo list variable
var repo_list_object;
var repoObjectsArray;
var newBranchesObject;
var repo_branch_list_array;

// The API calling variables.
var zenCallBack = function(err, val) {
  gitzen = val;
};
var api_calls_remain_callback = function(err, val) {
  API_count = val;
  // console.log("api_calls_remain_callback val = " + val);
};
var repoCallBack = function(err, val) {
  repo_list_object = val;
};

init();

function call_api_for_users_repos() {

  // If we don't have a repo object defined ...
  if (!repo_list_object) {
    octo.user.repos.fetch(repoCallBack);
    //waiting_loop();
  }
  //else

  if (repo_list_object) {
    //console.log("Num of Repos = " + repo_list_object.length);
    repoObjectsArray = [];
    for (var i = 0; i < repo_list_object.length; i++) {
      var repoName = repo_list_object[i].name;
      var repoGetBranchesURL = "https://api.github.com/repos/" + client_submitted_user_to_querry + "/" + repoName + "/branches";
      var newObject = [];
      newObject["branchesURL"] = repoGetBranchesURL;
      newObject["name"] = repoName;
      repoObjectsArray.push(newObject);
    }
  }
  else {
    waiting_loop(update_browser_repo_list, return_repos_list_object);
  }
}

function return_repos_list_object() {
  // console.log("return_repos_list_object called!!");
  return repo_list_object;
}

function update_browser_repo_list() {
  //console.log("In update_browser_repo_list() : Num of Repos = " + repo_list_object.length);
  console.log("Call to update_browser_repo_list()");
  update_repo_branch_list_array();
  document.getElementById("repo_list").innerHTML = repo_list_string;
}

function update_repo_branch_list_array() {
  //console.log("update_repo_branch_list_array() called!");
  //console.log("newBranchesObject = " + newBranchesObject);
  //console.log(newBranchesObject);
  // console.log("repo_list_object = " + repo_list_object);
  // console.log(repo_list_object);

  // For loop to populate the list of repos and their branches.
  for (var i = 0; i < repo_list_object.length; i++) {
    //console.log("repo_list_object[i].name = " + repo_list_object[i].name);

    // The repo name
    var repoNameToAdd = repo_list_object[i].name;

    var repoPagesURLToAdd = "http://" + client_submitted_user_to_querry + ".github.io/" + "" + repoNameToAdd + "/";

    // The API URL to get the branches data.
    // https://api.github.com/repos/KoreaHaos/ace/branches
    var repoBranchesAPI_URLToAdd = "https://api.github.com/repos/" + client_submitted_user_to_querry + "/" + repoNameToAdd + "/branches";

    var repoBranchesListToAdd = "NULL";

    var repo_branches_list_data_object = {
      repoName: repoNameToAdd,
      repoBranchesAPI_URL: repoBranchesAPI_URLToAdd,
      repoNumOfBranches: "NULL",
      repoPagesURL: repoPagesURLToAdd,
      repoHasGitHubPagesPage: "false",
      repoBranchesList: repoBranchesListToAdd
    };

    repo_branch_list_array.push(repo_branches_list_data_object);
  }
  //console.log(repo_branch_list_array);
  populate_list_with_branches_array();
  // console.log(repo_list_object);
}



var temp_branches_array;

function populate_list_with_branches_array() {
  // console.log("In populate_list_with_branches_array() : Num of Repos = " + repo_branch_list_array.length);
  // console.log(repo_branch_list_array);
  temp_branches_array = new Array();

  for (var i = 0; i < repo_branch_list_array.length; i++) {

    if (repo_branch_list_array[i].repoBranchesList === "NULL") {
      //console.log(repo_branch_list_array[i].repoName + "REPO NEEDS BRANCH LIST ARRAY!");

      // var variableForRepoBranchListCallBackToSet;
      var repo_branches_callback = function(err, val) {
        temp_branches_array.push(val);
        //document.getElementById("branch_objects_recieved").innerHTML = temp_branches_array.length;
        console.log("temp_branches_array.length = " + temp_branches_array.length);
        console.log("repo_branch_list_array.length = " + repo_branch_list_array.length);

        if (temp_branches_array.length === repo_branch_list_array.length) {
          console.log("Done creating temp_branches_array!");
          var temp_branches_array2 = new Array();
          for (var j = 0; j < temp_branches_array.length; j++) {
            // console.log(temp_branches_array[j][0].commit.url);
            // console.log(get_repo_name_from_commits_url(temp_branches_array[j][0].commit.url));
            var reposName = get_repo_name_from_commits_url(temp_branches_array[j][0].commit.url);
            var temp_object = {
              nameOfRepo: reposName,
              apiBranchReturnObject: temp_branches_array[j]
            };
            temp_branches_array2.push(temp_object);
            // console.log(temp_branches_array2.length);
          }
          //console.log(temp_branches_array2);
          console.log("Done creating temp_branches_array2!");
          mergeArrays(temp_branches_array2);
        }
      };

      octo.fromUrl(repo_branch_list_array[i].repoBranchesAPI_URL).fetch(repo_branches_callback);
    } // End of if statement to check if population is needed.
  } // End of for loop to populate array.
} // End of populate_list_with_branches_array() function.

function mergeArrays(arrayToMergeIntoRepoBranchListArray) {
  if (arrayToMergeIntoRepoBranchListArray.length === repo_branch_list_array.length) {
    console.log("Arrays are the same size, merge attempt will begin!");
    console.log("* * * arrayToMergeIntoRepoBranchListArray * * *");
    console.log(arrayToMergeIntoRepoBranchListArray);
    console.log("* * * repo_branch_list_array * * *");
    console.log(repo_branch_list_array);

    var matchCount = 0;
    for (var Zz = 0; Zz < repo_branch_list_array.length; Zz++) {
      //console.log(repo_branch_list_array[Zz].repoName);
      //console.log(repo_branch_list_array[Zz].repoBranchesList);
      for (var Xx = 0; Xx < arrayToMergeIntoRepoBranchListArray.length; Xx++) {
        if (arrayToMergeIntoRepoBranchListArray[Xx].nameOfRepo === repo_branch_list_array[Zz].repoName) {
          matchCount++;
          //console.log("We have a match! matchCount = " + matchCount);
          repo_branch_list_array[Zz].repoBranchesList = arrayToMergeIntoRepoBranchListArray[Xx].apiBranchReturnObject;
          repo_branch_list_array[Zz].repoNumOfBranches = arrayToMergeIntoRepoBranchListArray[Xx].apiBranchReturnObject.length;
        }
      }
    }
  }
  else {
    console.log("Arrays are NOT the same size, WTF? ERROR error ERROR error ERROR error!!");
  }

  console.log("FINISHED mergeArrays()!");
  console.log("Merged Array : ");
  //console.log(repo_branch_list_array);
  check_for_gh_pages_branch();
  make_repo_list_string();
  update_browser_repo_list();
  console.log(repo_branch_list_array);
}

function check_for_gh_pages_branch() {
  for (var i = 0; i < repo_branch_list_array.length; i++) {
    console.log(i + " R --" + repo_branch_list_array[i].repoName);
    for (var j = 0; j < repo_branch_list_array[i]["repoBranchesList"].length; j++) {
      if (repo_branch_list_array[i]["repoBranchesList"][j]["name"] === "gh-pages") {
        repo_branch_list_array[i]["repoHasGitHubPagesPage"] = "true";
      }
      console.log("   |-" + j + "---" + repo_branch_list_array[i]["repoBranchesList"][j]["name"] + "  -  " + repo_branch_list_array[i]["repoHasGitHubPagesPage"]);
    }
  }
}

function make_repo_list_string() {
  repo_list_string = "";
  repo_list_string += "<ul>";

  for (var i = 0; i < repo_branch_list_array.length; i++) {
    repo_list_string += "<li>";
    // repo_list_string += "REPO #" + i + " ";
    repo_list_string += repo_branch_list_array[i].repoName + " ";
    if (repo_branch_list_array[i]["repoHasGitHubPagesPage"] === "true") {
      // <a href="http://www.w3schools.com/" target="_blank">Visit W3Schools!</a>
      repo_list_string += "<a href=\"";
      repo_list_string += repo_branch_list_array[i].repoPagesURL + " ";
      repo_list_string += "\" target=\"_blank\">gh-pages site</a>";
    }
    repo_list_string += "</li>";
  }
  repo_list_string += "</ul>";
  console.log("FINISHED make_repo_list_string()");
}

function get_repo_name_from_commits_url(url_to_parse) {
  var returnString = "";
  var stringArraySplitOnForwardSlash = url_to_parse.split("/");
  returnString = stringArraySplitOnForwardSlash[5];
  return returnString;
}

function browser_display_repos() {

  var displayString = getRepoListDisplayString();

  document.getElementById("user_repo_branch_info").innerHTML = "<p>REPO INFO :</br> " + displayString + "</p>";

}

function getRepoListDisplayString() {
  var returnString = "<ul>";
  var gh_pages_string = "\"http://" + client_submitted_user_to_querry + ".github.io/";

  //for (var i = 0; i < finalRepoBranchArray.length; i++) {
  for (var i = 0; i < 30; i++) {
    //returnString += "<li> " + i + "</li>";
    var insertString = "";
    //insertString += " " + finalRepoBranchArray[i].branches.length + " ";
    //insertString += " num branches = " + finalRepoBranchArray[i].branches.length;
    insertString += "";
    insertString += "<li>";
    insertString += "Repo #" + (i + 1) + " ";
    insertString += finalRepoBranchArray[i].repoInfo.name;
    insertString += " ";
    insertString += "";
    for (var j = 0; j < finalRepoBranchArray[i].branches.length; j++) {
      if (finalRepoBranchArray[i].branches[j].name == "gh-pages") {
        var insertLinkString = "<a href=" + gh_pages_string + finalRepoBranchArray[i].repoInfo.name + "/\" target=\"_blank\">";
        insertString += insertLinkString + " GH_PAGES!</a>";
      }
      else {
        //insertString += " x";
      }
    }
    returnString += insertString;
    returnString += "</li>";
  }
  returnString += "</ul>";
  return returnString;
}

function console_show_repos_branches() {

  // If newBranchesObject is undefined ...
  if (!newBranchesObject) {
    console.log("console_show_repos_branches : first if statement!!");
    console.log("if says newBranchesObject undefined!!");
    /*
    console.log("newBranchesObject = " + newBranchesObject);
    console.log("repo_list_object = " + repo_list_object);
    console.log(newBranchesObject);
    console.log(repo_list_object);
    */

  }

  if (newBranchesObject) {
    console.log("console_show_repos_branches : second if statement!!");
    console.log("if says newBranchesObject defined!!");
    /*
    console.log("newBranchesObject = " + newBranchesObject);
    console.log("repo_list_object = " + repo_list_object);
    console.log(newBranchesObject);
    console.log(repo_list_object);
    */

  }
  else {
    console.log("console_show_repos_branches : second if statement!!");
    console.log("if says newBranchesObject undefined!!");
    /*
    console.log("newBranchesObject = " + newBranchesObject);
    console.log("repo_list_object = " + repo_list_object);
    console.log(newBranchesObject);
    console.log(repo_list_object);
    */

  }
}

function return_browser_branches_object() {
  return newBranchesObject;
}

// User Being Querried Division

function update_user_being_querried() {

  if (client_submitted_user_to_querry == "") {
    client_submitted_user_to_querry = default_user_to_querry;
  }
  document.getElementById("user_being_querried").innerHTML = "User being querried = " + client_submitted_user_to_querry;
}

function display_instruction(string_to_display) {
  document.getElementById("instruction").innerHTML = string_to_display;
}

function display_main_heading(string_to_display) {

  string_to_display = "<h1>" + string_to_display + "</h1>"
  document.getElementById("main_heading").innerHTML = string_to_display;
}

// Set GitHub user to Querry button

function set_user_to_querry() {
  console.log("set_user_to_querry() called.");
  create_input_field();
}

function create_input_field() {
  var input_field__html_string = "<input type=\"text\" id=\"submitedGitHubUser\" value=\"" + default_user_to_querry + "\">";
  var input_button_html_string = "<input id=\"ghSetGitHubUserButton\" type=\"button\" value=\"TRY IT\" />";
  document.getElementById("set_user_field").innerHTML = input_field__html_string + input_button_html_string;
  document.getElementById("ghSetGitHubUserButton").onclick = set_user_name;

}

function destroy_input_field() {
  document.getElementById("set_user_field").innerHTML = "";
}

function set_user_name() {
  var client_delivered_user_to_querry = document.getElementById("submitedGitHubUser").value;
  //alert(client_delivered_user_to_querry);

  client_submitted_user_to_querry = client_delivered_user_to_querry;
  destroy_input_field();
  update_dom();
}

// The API calls remaining button

function querry_api_calls_remaining() {
  if (!API_count) {
    //console.log("API_count is undefined");
    octo.fromUrl("https://api.github.com/rate_limit").fetch(api_calls_remain_callback);
    //console.log("querry_api_calls_remaining has finished!!");
  }

  if (API_count) {
    //console.log("API_count is defined");
    //console.log("API_count = " + API_count);
    update_api_count_display();
  }
  else {
    //console.log("Calling waiting_loop from querry_api_calls_remaining!!");
    //console.log("In querry_api_calls_remaining octo = " + octo + "!!");
    octo.fromUrl("https://api.github.com/rate_limit").fetch(api_calls_remain_callback);
    waiting_loop(update_api_count_display, return_api_count);
  }
}

function update_api_count_display() {

  var remaining_calls = API_count.rate.remaining;
  document.getElementById("client_remaining_calls").innerHTML = "<p>Remaining API calls : " + remaining_calls + "</p>";
  // console.log("API_count is being un-defined!!");
  API_count = (function() {
    return;
  })();
}

function return_api_count() {
  return API_count;
  console.log("Returning : API_count!!");
}

// The zen button.

function update_browser_zen() {
  document.getElementById("git_zen").innerHTML = "<p>GitZen : " + gitzen + "</p>";
}

function zen() {
  // If the variable the callback sets is not defined ...
  if (!gitzen) {
    octo.zen.read(zenCallBack);
  }
  // If it is defined, or it gets defined very quickly ...
  if (gitzen) {
    update_browser_zen();
  }
  else {
    waiting_loop(update_browser_zen, return_gitzen);
  }
}

function return_gitzen() {
  return gitzen;
}

// The Waiting Loop.
/*
 __      __        .__  __  .__               .____                         
/  \    /  \_____  |__|/  |_|__| ____    ____ |    |    ____   ____ ______  
\   \/\/   /\__  \ |  \   __\  |/    \  / ___\|    |   /  _ \ /  _ \\____ \ 
 \        /  / __ \|  ||  | |  |   |  \/ /_/  >    |__(  <_> |  <_> )  |_> >
  \__/\  /  (____  /__||__| |__|___|  /\___  /|_______ \____/ \____/|   __/ 
       \/        \/                 \//_____/         \/            |__|    

Required information from:

Source : http://stackoverflow.com/questions/4548034/create-a-pause-inside-a-while-loop-in-javascript
Source : http://stackoverflow.com/questions/13286233/pass-a-javascript-function-as-parameter
*/

function waiting_loop(function_to_call_when_done, var_to_wait_on) {

  if (!var_to_wait_on()) {
    signal = "!loaded";
    show_waiting_gif();
  }
  else {
    signal = "loaded";
    remove_waiting_gif();
    function_to_call_when_done();
    count = max_count;
  }
  // console.log((count + 1) + " - waiting_loop() signal = " + signal);
  setTimeout(function() {
    count++;
    if (count < max_count) {
      waiting_loop(function_to_call_when_done, var_to_wait_on);
    }
    else {
      count = 0;
    }
  }, 3000);
}

function show_waiting_gif() {
  document.getElementById("loading").innerHTML = "<img src=\"../gifs/waiting_white.gif\" alt=\"waiting gif\" style=\"width:100px;height:100px;\">";
}

function remove_waiting_gif() {
  document.getElementById("loading").innerHTML = "<p>DONE (Perhaps Update the DOM?)</p>";
}

function show_fail_gif() {
  document.getElementById("loading").innerHTML = "<img src=\"../gifs/fail_animation.gif\" alt=\"waiting gif\" style=\"width:100px;height:100px;\">";
}

function remove_fail_gif() {
  document.getElementById("loading").innerHTML = "<p>DONE (Perhaps Update the DOM?)</p>";
}

function init() {
  Octokat = require('octokat');
/*
._.  _____                                     ._.___________     __                ._.
| | /  _  \   ____  ____  ____   ______ ______ | |\__    ___/___ |  | __ ____   ____| |
| |/  /_\  \_/ ___\/ ___\/ __ \ /  ___//  ___/ | |  |    | /  _ \|  |/ // __ \ /    \ |
 \/    |    \  \__\  \__\  ___/ \___ \ \___ \   \|  |    |(  <_> )    <\  ___/|   |  \|
 _\____|__  /\___  >___  >___  >____  >____  >  __  |____| \____/|__|_ \\___  >___|  /_
 \/       \/     \/    \/    \/     \/     \/   \/                    \/    \/     \/\/

*/
  octo = new Octokat({
    token: "d585873790876124d821a9351918386be5029076"
  });

  // display_main_heading(main_heading_string);
  // display_instruction(intro_string);
  // update_user_being_querried();
  // display_api_calls_remaining(); <-- ToDo FIX THIS!
  querry_api_calls_remaining();

  repo_branch_list_array = new Array();

  document.getElementById("ghSetUserToQuerryButton").onclick = set_user_to_querry;
  document.getElementById("ghShowUsersRepoButton").onclick = call_api_for_users_repos;
  document.getElementById("ghShowUsersReposBranchesButton").onclick = console_show_repos_branches;
  document.getElementById("ghDisplayInfoToBrowser").onclick = browser_display_repos;
  document.getElementById("ghCallsRemainingButton").onclick = querry_api_calls_remaining;
  document.getElementById("ghZenButton").onclick = zen;
  document.getElementById("resetButton").onclick = reset_window;

  update_dom();
}

function update_dom() {

  display_main_heading(main_heading_string);
  display_instruction(intro_string);
  update_user_being_querried(); // <-- ToDo FIX THIS!
  // update_api_count_display(); // <-- ToDo FIX THIS!

}

// The reset window button.

function reset_window() {
  location.reload();
}

/*
  token: ""
*/


// source of library : https://www.npmjs.com/package/octokat
// ToDoLater = You can omit `cb` and use Promises instead

},{"octokat":12}],2:[function(require,module,exports){
(function() {
  var Chainer, injectVerbMethods, plus,
    slice = [].slice;

  plus = require('./plus');

  injectVerbMethods = require('./verb-methods');

  Chainer = function(request, path, name, contextTree, fn) {
    var fn1;
    if (fn == null) {
      fn = function() {
        var args, separator;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (!args.length) {
          throw new Error('BUG! must be called with at least one argument');
        }
        if (name === 'compare') {
          separator = '...';
        } else {
          separator = '/';
        }
        return Chainer(request, path + "/" + (args.join(separator)), name, contextTree);
      };
    }
    injectVerbMethods(request, path, fn);
    if (typeof fn === 'function' || typeof fn === 'object') {
      fn1 = function(name) {
        delete fn[plus.camelize(name)];
        return Object.defineProperty(fn, plus.camelize(name), {
          configurable: true,
          enumerable: true,
          get: function() {
            return Chainer(request, path + "/" + name, name, contextTree[name]);
          }
        });
      };
      for (name in contextTree || {}) {
        fn1(name);
      }
    }
    return fn;
  };

  module.exports = Chainer;

}).call(this);

},{"./plus":8,"./verb-methods":11}],3:[function(require,module,exports){
(function() {
  var DEFAULT_HEADER, OBJECT_MATCHER, PREVIEW_HEADERS, TREE_OPTIONS, URL_VALIDATOR;

  URL_VALIDATOR = /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/(zen|octocat|users|organizations|issues|gists|emojis|markdown|meta|rate_limit|feeds|events|notifications|notifications\/threads(\/[^\/]+)|notifications\/threads(\/[^\/]+)\/subscription|gitignore\/templates(\/[^\/]+)?|user|user\/(repos|orgs|followers|following(\/[^\/]+)?|emails(\/[^\/]+)?|issues|starred|starred(\/[^\/]+){2}|teams)|orgs\/[^\/]+|orgs\/[^\/]+\/(repos|issues|members|events|teams)|teams\/[^\/]+|teams\/[^\/]+\/(members(\/[^\/]+)?|memberships\/[^\/]+|repos|repos(\/[^\/]+){2})|users\/[^\/]+|users\/[^\/]+\/(repos|orgs|gists|followers|following(\/[^\/]+){0,2}|keys|starred|received_events(\/public)?|events(\/public)?|events\/orgs\/[^\/]+)|search\/(repositories|issues|users|code)|gists\/(public|starred|([a-f0-9]{20}|[0-9]+)|([a-f0-9]{20}|[0-9]+)\/forks|([a-f0-9]{20}|[0-9]+)\/comments(\/[0-9]+)?|([a-f0-9]{20}|[0-9]+)\/star)|repos(\/[^\/]+){2}|repos(\/[^\/]+){2}\/(readme|tarball(\/[^\/]+)?|zipball(\/[^\/]+)?|compare\/([^\.{3}]+)\.{3}([^\.{3}]+)|deployments(\/[0-9]+)?|deployments\/[0-9]+\/statuses(\/[0-9]+)?|hooks|hooks\/[^\/]+|hooks\/[^\/]+\/tests|assignees|languages|teams|tags|branches(\/[^\/]+){0,2}|contributors|subscribers|subscription|stargazers|comments(\/[0-9]+)?|downloads(\/[0-9]+)?|forks|milestones|milestones\/[0-9]+|milestones\/[0-9]+\/labels|labels(\/[^\/]+)?|releases|releases\/([0-9]+)|releases\/([0-9]+)\/assets|releases\/latest|releases\/tags\/([^\/]+)|releases\/assets\/([0-9]+)|events|notifications|merges|statuses\/[a-f0-9]{40}|pages|pages\/builds|pages\/builds\/latest|commits|commits\/[a-f0-9]{40}|commits\/[a-f0-9]{40}\/(comments|status|statuses)?|contents\/|contents(\/[^\/]+)*|collaborators(\/[^\/]+)?|(issues|pulls)|(issues|pulls)\/(events|events\/[0-9]+|comments(\/[0-9]+)?|[0-9]+|[0-9]+\/events|[0-9]+\/comments|[0-9]+\/labels(\/[^\/]+)?)|pulls\/[0-9]+\/(files|commits)|git\/(refs|refs\/(.+|heads(\/[^\/]+)?|tags(\/[^\/]+)?)|trees(\/[^\/]+)?|blobs(\/[a-f0-9]{40}$)?|commits(\/[a-f0-9]{40}$)?)|stats\/(contributors|commit_activity|code_frequency|participation|punch_card))|licenses|licenses\/([^\/]+)|authorizations|authorizations\/((\d+)|clients\/([^\/]{20})|clients\/([^\/]{20})\/([^\/]+))|applications\/([^\/]{20})\/tokens|applications\/([^\/]{20})\/tokens\/([^\/]+)|enterprise\/(settings\/license|stats\/(issues|hooks|milestones|orgs|comments|pages|users|gists|pulls|repos|all))|staff\/indexing_jobs|users\/[^\/]+\/(site_admin|suspended)|setup\/api\/(start|upgrade|configcheck|configure|settings(authorized-keys)?|maintenance))$/;

  TREE_OPTIONS = {
    'zen': false,
    'octocat': false,
    'organizations': false,
    'issues': false,
    'emojis': false,
    'markdown': false,
    'meta': false,
    'rate_limit': false,
    'feeds': false,
    'events': false,
    'notifications': {
      'threads': {
        'subscription': false
      }
    },
    'gitignore': {
      'templates': false
    },
    'user': {
      'repos': false,
      'orgs': false,
      'followers': false,
      'following': false,
      'emails': false,
      'issues': false,
      'starred': false,
      'teams': false
    },
    'orgs': {
      'repos': false,
      'issues': false,
      'members': false,
      'events': false,
      'teams': false
    },
    'teams': {
      'members': false,
      'memberships': false,
      'repos': false
    },
    'users': {
      'repos': false,
      'orgs': false,
      'gists': false,
      'followers': false,
      'following': false,
      'keys': false,
      'starred': false,
      'received_events': {
        'public': false
      },
      'events': {
        'public': false,
        'orgs': false
      },
      'site_admin': false,
      'suspended': false
    },
    'search': {
      'repositories': false,
      'issues': false,
      'users': false,
      'code': false
    },
    'gists': {
      'public': false,
      'starred': false,
      'star': false,
      'comments': false,
      'forks': false
    },
    'repos': {
      'readme': false,
      'tarball': false,
      'zipball': false,
      'compare': false,
      'deployments': {
        'statuses': false
      },
      'hooks': {
        'tests': false
      },
      'assignees': false,
      'languages': false,
      'teams': false,
      'tags': false,
      'branches': false,
      'contributors': false,
      'subscribers': false,
      'subscription': false,
      'stargazers': false,
      'comments': false,
      'downloads': false,
      'forks': false,
      'milestones': {
        'labels': false
      },
      'labels': false,
      'releases': {
        'assets': false,
        'latest': false,
        'tags': false
      },
      'events': false,
      'notifications': false,
      'merges': false,
      'statuses': false,
      'pulls': {
        'merge': false,
        'comments': false,
        'commits': false,
        'files': false,
        'events': false,
        'labels': false
      },
      'pages': {
        'builds': {
          'latest': false
        }
      },
      'commits': {
        'comments': false,
        'status': false,
        'statuses': false
      },
      'contents': false,
      'collaborators': false,
      'issues': {
        'events': false,
        'comments': false,
        'labels': false
      },
      'git': {
        'refs': {
          'heads': false,
          'tags': false
        },
        'trees': false,
        'blobs': false,
        'commits': false
      },
      'stats': {
        'contributors': false,
        'commit_activity': false,
        'code_frequency': false,
        'participation': false,
        'punch_card': false
      }
    },
    'licenses': false,
    'authorizations': {
      'clients': false
    },
    'applications': {
      'tokens': false
    },
    'enterprise': {
      'settings': {
        'license': false
      },
      'stats': {
        'issues': false,
        'hooks': false,
        'milestones': false,
        'orgs': false,
        'comments': false,
        'pages': false,
        'users': false,
        'gists': false,
        'pulls': false,
        'repos': false,
        'all': false
      }
    },
    'staff': {
      'indexing_jobs': false
    },
    'setup': {
      'api': {
        'start': false,
        'upgrade': false,
        'configcheck': false,
        'configure': false,
        'settings': {
          'authorized-keys': false
        },
        'maintenance': false
      }
    }
  };

  OBJECT_MATCHER = {
    'repos': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+$/,
    'gists': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/gists\/[^\/]+$/,
    'issues': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/(issues|pulls)[^\/]+$/,
    'users': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/[^\/]+$/,
    'orgs': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/orgs\/[^\/]+$/,
    'repos.comments': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/comments\/[^\/]+$/
  };

  PREVIEW_HEADERS = {
    'application/vnd.github.drax-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/licenses|\/licenses\/([^\/]+)|\/repos\/([^\/]+)\/([^\/]+))$/,
    'application/vnd.github.v3.star+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/([^\/]+)\/starred$/,
    'application/vnd.github.mirage-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/authorizations|\/authorizations\/clients\/([^\/]{20})|\/authorizations\/clients\/([^\/]{20})\/([^\/]+)|\/authorizations\/([\d]+)|\/applications\/([^\/]{20})\/tokens|\/applications\/([^\/]{20})\/tokens\/([^\/]+))$/
  };

  DEFAULT_HEADER = function(url) {
    var key, val;
    for (key in PREVIEW_HEADERS) {
      val = PREVIEW_HEADERS[key];
      if (val.test(url)) {
        return key;
      }
    }
    return 'application/vnd.github.v3+json';
  };

  module.exports = {
    URL_VALIDATOR: URL_VALIDATOR,
    TREE_OPTIONS: TREE_OPTIONS,
    OBJECT_MATCHER: OBJECT_MATCHER,
    DEFAULT_HEADER: DEFAULT_HEADER
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function (global){
(function() {
  var base64encode;

  if (typeof window !== "undefined" && window !== null) {
    base64encode = window.btoa;
  } else if (typeof global !== "undefined" && global !== null ? global['Buffer'] : void 0) {
    base64encode = function(str) {
      var buffer;
      buffer = new global['Buffer'](str, 'binary');
      return buffer.toString('base64');
    };
  } else {
    throw new Error('Native btoa function or Buffer is missing');
  }

  module.exports = base64encode;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function() {
  var Promise, allPromises, injector, newPromise, ref, req, toPromise,
    slice = [].slice;

  if (typeof window !== "undefined" && window !== null) {
    if (window.Q) {
      newPromise = (function(_this) {
        return function(fn) {
          var deferred, reject, resolve;
          deferred = window.Q.defer();
          resolve = function(val) {
            return deferred.resolve(val);
          };
          reject = function(err) {
            return deferred.reject(err);
          };
          fn(resolve, reject);
          return deferred.promise;
        };
      })(this);
      allPromises = function(promises) {
        return window.Q.all(promises);
      };
    } else if (window.angular) {
      newPromise = null;
      allPromises = null;
      injector = angular.injector(['ng']);
      injector.invoke(function($q) {
        newPromise = function(fn) {
          var deferred, reject, resolve;
          deferred = $q.defer();
          resolve = function(val) {
            return deferred.resolve(val);
          };
          reject = function(err) {
            return deferred.reject(err);
          };
          fn(resolve, reject);
          return deferred.promise;
        };
        return allPromises = function(promises) {
          return $q.all(promises);
        };
      });
    } else if ((ref = window.jQuery) != null ? ref.Deferred : void 0) {
      newPromise = (function(_this) {
        return function(fn) {
          var promise, reject, resolve;
          promise = window.jQuery.Deferred();
          resolve = function(val) {
            return promise.resolve(val);
          };
          reject = function(val) {
            return promise.reject(val);
          };
          fn(resolve, reject);
          return promise.promise();
        };
      })(this);
      allPromises = (function(_this) {
        return function(promises) {
          var ref1;
          return (ref1 = window.jQuery).when.apply(ref1, promises).then(function() {
            var promises;
            promises = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return promises;
          });
        };
      })(this);
    } else if (window.Promise) {
      newPromise = (function(_this) {
        return function(fn) {
          return new window.Promise(function(resolve, reject) {
            if (resolve.fulfill) {
              return fn(resolve.resolve.bind(resolve), resolve.reject.bind(resolve));
            } else {
              return fn.apply(null, arguments);
            }
          });
        };
      })(this);
      allPromises = (function(_this) {
        return function(promises) {
          return window.Promise.all(promises);
        };
      })(this);
    } else {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.warn === "function") {
          console.warn('Octokat: A Promise API was not found. Supported libraries that have Promises are jQuery, angularjs, and es6-promise');
        }
      }
    }
  } else {
    req = require;
    Promise = this.Promise || req('es6-promise').Promise;
    newPromise = function(fn) {
      return new Promise(fn);
    };
    allPromises = function(promises) {
      return Promise.all(promises);
    };
  }

  toPromise = function(orig) {
    return function() {
      var args, last;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      last = args[args.length - 1];
      if (typeof last === 'function') {
        args.pop();
        return orig.apply(null, [last].concat(slice.call(args)));
      } else if (newPromise) {
        return newPromise(function(resolve, reject) {
          var cb;
          cb = function(err, val) {
            if (err) {
              return reject(err);
            }
            return resolve(val);
          };
          return orig.apply(null, [cb].concat(slice.call(args)));
        });
      } else {
        throw new Error('You must specify a callback or have a promise library loaded');
      }
    };
  };

  module.exports = {
    newPromise: newPromise,
    allPromises: allPromises,
    toPromise: toPromise
  };

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  var toQueryString;

  toQueryString = function(options) {
    var key, params, ref, value;
    if (!options || options === {}) {
      return '';
    }
    params = [];
    ref = options || {};
    for (key in ref) {
      value = ref[key];
      params.push(key + "=" + (encodeURIComponent(value)));
    }
    return "?" + (params.join('&'));
  };

  module.exports = toQueryString;

}).call(this);

},{}],7:[function(require,module,exports){
(function (global){
(function() {
  var Chainer, OBJECT_MATCHER, Octokat, Replacer, Request, TREE_OPTIONS, injectVerbMethods, parse, plus, reChainChildren, ref, toPromise;

  plus = require('./plus');

  ref = require('./grammar'), TREE_OPTIONS = ref.TREE_OPTIONS, OBJECT_MATCHER = ref.OBJECT_MATCHER;

  Chainer = require('./chainer');

  injectVerbMethods = require('./verb-methods');

  Replacer = require('./replacer');

  Request = require('./request');

  toPromise = require('./helper-promise').toPromise;

  reChainChildren = function(request, url, obj) {
    var context, i, k, key, len, re, ref1;
    for (key in OBJECT_MATCHER) {
      re = OBJECT_MATCHER[key];
      if (re.test(obj.url)) {
        context = TREE_OPTIONS;
        ref1 = key.split('.');
        for (i = 0, len = ref1.length; i < len; i++) {
          k = ref1[i];
          context = context[k];
        }
        Chainer(request, url, k, context, obj);
      }
    }
    return obj;
  };

  parse = function(obj, path, request) {
    var replacer, url;
    url = obj.url || path;
    if (url) {
      replacer = new Replacer(request);
      obj = replacer.replace(obj);
      Chainer(request, url, true, {}, obj);
      reChainChildren(request, url, obj);
    } else {
      Chainer(request, '', null, TREE_OPTIONS, obj);
    }
    return obj;
  };

  Octokat = function(clientOptions) {
    var disableHypermedia, obj, request;
    if (clientOptions == null) {
      clientOptions = {};
    }
    disableHypermedia = clientOptions.disableHypermedia;
    if (disableHypermedia == null) {
      disableHypermedia = false;
    }
    request = function(method, path, data, options, cb) {
      var _request, ref1, replacer;
      if (options == null) {
        options = {
          raw: false,
          isBase64: false,
          isBoolean: false
        };
      }
      replacer = new Replacer(request);
      if (data && !(typeof global !== "undefined" && global !== null ? (ref1 = global['Buffer']) != null ? ref1.isBuffer(data) : void 0 : void 0)) {
        data = replacer.uncamelize(data);
      }
      _request = Request(clientOptions);
      return _request(method, path, data, options, function(err, val) {
        var obj;
        if (err) {
          return cb(err);
        }
        if (options.raw) {
          return cb(null, val);
        }
        if (!disableHypermedia) {
          obj = parse(val, path, request);
          return cb(null, obj);
        } else {
          return cb(null, val);
        }
      });
    };
    obj = {};
    Chainer(request, '', null, TREE_OPTIONS, obj);
    obj.me = obj.user;
    obj.parse = function(jsonObj) {
      return parse(jsonObj, '', request);
    };
    obj.fromUrl = function(path) {
      var ret;
      ret = {};
      injectVerbMethods(request, path, ret);
      return ret;
    };
    obj.status = toPromise(function(cb) {
      return request('GET', 'https://status.github.com/api/status.json', null, null, cb);
    });
    obj.status.api = toPromise(function(cb) {
      return request('GET', 'https://status.github.com/api.json', null, null, cb);
    });
    obj.status.lastMessage = toPromise(function(cb) {
      return request('GET', 'https://status.github.com/api/last-message.json', null, null, cb);
    });
    obj.status.messages = toPromise(function(cb) {
      return request('GET', 'https://status.github.com/api/messages.json', null, null, cb);
    });
    return obj;
  };

  module.exports = Octokat;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./chainer":2,"./grammar":3,"./helper-promise":5,"./plus":8,"./replacer":9,"./request":10,"./verb-methods":11}],8:[function(require,module,exports){
(function() {
  var plus;

  plus = {
    camelize: function(string) {
      if (string) {
        return string.replace(/[_-]+(\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      } else {
        return '';
      }
    },
    uncamelize: function(string) {
      if (!string) {
        return '';
      }
      return string.replace(/([A-Z])+/g, function(match, letter) {
        if (letter == null) {
          letter = '';
        }
        return "_" + (letter.toLowerCase());
      });
    },
    dasherize: function(string) {
      if (!string) {
        return '';
      }
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(_)/g, function(m, letter) {
        if (letter) {
          return '-' + letter.toLowerCase();
        } else {
          return '-';
        }
      });
    }
  };

  module.exports = plus;

}).call(this);

},{}],9:[function(require,module,exports){
(function() {
  var Chainer, OBJECT_MATCHER, Replacer, TREE_OPTIONS, plus, ref, toPromise, toQueryString,
    slice = [].slice;

  plus = require('./plus');

  toPromise = require('./helper-promise').toPromise;

  toQueryString = require('./helper-querystring');

  ref = require('./grammar'), TREE_OPTIONS = ref.TREE_OPTIONS, OBJECT_MATCHER = ref.OBJECT_MATCHER;

  Chainer = require('./chainer');

  Replacer = (function() {
    function Replacer(_request) {
      this._request = _request;
    }

    Replacer.prototype.uncamelize = function(obj) {
      var i, j, key, len, o, ref1, value;
      if (Array.isArray(obj)) {
        return (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = obj.length; j < len; j++) {
            i = obj[j];
            results.push(this.uncamelize(i));
          }
          return results;
        }).call(this);
      } else if (obj === Object(obj)) {
        o = {};
        ref1 = Object.keys(obj);
        for (j = 0, len = ref1.length; j < len; j++) {
          key = ref1[j];
          value = obj[key];
          o[plus.uncamelize(key)] = this.uncamelize(value);
        }
        return o;
      } else {
        return obj;
      }
    };

    Replacer.prototype.replace = function(o) {
      if (Array.isArray(o)) {
        return this._replaceArray(o);
      } else if (o === Object(o)) {
        return this._replaceObject(o);
      } else {
        return o;
      }
    };

    Replacer.prototype._replaceObject = function(orig) {
      var acc, context, j, k, key, l, len, len1, len2, n, re, ref1, ref2, ref3, url, value;
      acc = {};
      ref1 = Object.keys(orig);
      for (j = 0, len = ref1.length; j < len; j++) {
        key = ref1[j];
        value = orig[key];
        this._replaceKeyValue(acc, key, value);
      }
      url = acc.url;
      if (url) {
        Chainer(this._request, url, true, null, acc);
      }
      ref2 = Object.keys(OBJECT_MATCHER);
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        key = ref2[l];
        re = OBJECT_MATCHER[key];
        if (re.test(url)) {
          context = TREE_OPTIONS;
          ref3 = key.split('.');
          for (n = 0, len2 = ref3.length; n < len2; n++) {
            k = ref3[n];
            context = context[k];
          }
          Chainer(this._request, url, k, context, acc);
        }
      }
      return acc;
    };

    Replacer.prototype._replaceArray = function(orig) {
      var arr, item, j, key, len, ref1, value;
      arr = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = orig.length; j < len; j++) {
          item = orig[j];
          results.push(this.replace(item));
        }
        return results;
      }).call(this);
      ref1 = Object.keys(orig);
      for (j = 0, len = ref1.length; j < len; j++) {
        key = ref1[j];
        value = orig[key];
        this._replaceKeyValue(arr, key, value);
      }
      return arr;
    };

    Replacer.prototype._replaceKeyValue = function(acc, key, value) {
      var fn, newKey;
      if (/_url$/.test(key)) {
        fn = (function(_this) {
          return function() {
            var args, cb, contentType, data, i, j, len, m, match, optionalNames, param, paramName, ref1, ref2, url;
            cb = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            if (!(/\{/.test(value) || /_page_url$/.test(key))) {
              console.warn('Deprecation warning: Use the .fooUrl field instead of calling the method');
            }
            url = value;
            i = 0;
            while (m = /(\{[^\}]+\})/.exec(url)) {
              match = m[1];
              if (i < args.length) {
                param = args[i];
                switch (match[1]) {
                  case '/':
                    param = "/" + param;
                    break;
                  case '?':
                    optionalNames = match.slice(2, -1).split(',');
                    if (typeof param === 'object') {
                      if (Object.keys(param).length === 0) {
                        console.warn('Must pass in a dictionary with at least one key when there are multiple optional params');
                      }
                      ref1 = Object.keys(param);
                      for (j = 0, len = ref1.length; j < len; j++) {
                        paramName = ref1[j];
                        if (optionalNames.indexOf(paramName) < 0) {
                          console.warn("Invalid parameter '" + paramName + "' passed in as argument");
                        }
                      }
                      param = toQueryString(param);
                    } else {
                      param = "?" + optionalNames[0] + "=" + param;
                    }
                }
              } else {
                param = '';
                if (match[1] !== '/') {
                  throw new Error("BUG: Missing required parameter " + match);
                }
              }
              url = url.replace(match, param);
              i++;
            }
            if (/upload_url$/.test(key)) {
              ref2 = args.slice(-2), contentType = ref2[0], data = ref2[1];
              return _this._request('POST', url, data, {
                contentType: contentType,
                raw: true
              }, cb);
            } else {
              return _this._request('GET', url, null, null, cb);
            }
          };
        })(this);
        fn = toPromise(fn);
        fn.url = value;
        newKey = key.substring(0, key.length - '_url'.length);
        acc[plus.camelize(newKey)] = fn;
        if (!/\{/.test(value)) {
          return acc[plus.camelize(key)] = value;
        }
      } else if (/_at$/.test(key)) {
        return acc[plus.camelize(key)] = value ? new Date(value) : null;
      } else {
        return acc[plus.camelize(key)] = this.replace(value);
      }
    };

    return Replacer;

  })();

  module.exports = Replacer;

}).call(this);

},{"./chainer":2,"./grammar":3,"./helper-promise":5,"./helper-querystring":6,"./plus":8}],10:[function(require,module,exports){
(function() {
  var DEFAULT_HEADER, ETagResponse, Request, ajax, base64encode, userAgent;

  base64encode = require('./helper-base64');

  DEFAULT_HEADER = require('./grammar').DEFAULT_HEADER;

  if (typeof window === "undefined" || window === null) {
    userAgent = 'octokat.js';
  }

  ajax = function(options, cb) {
    var XMLHttpRequest, name, ref, req, value, xhr;
    if (typeof window !== "undefined" && window !== null) {
      XMLHttpRequest = window.XMLHttpRequest;
    } else {
      req = require;
      XMLHttpRequest = req('xmlhttprequest').XMLHttpRequest;
    }
    xhr = new XMLHttpRequest();
    xhr.dataType = options.dataType;
    if (typeof xhr.overrideMimeType === "function") {
      xhr.overrideMimeType(options.mimeType);
    }
    xhr.open(options.type, options.url);
    if (options.data && options.type !== 'GET') {
      xhr.setRequestHeader('Content-Type', options.contentType);
    }
    ref = options.headers;
    for (name in ref) {
      value = ref[name];
      xhr.setRequestHeader(name, value);
    }
    xhr.onreadystatechange = function() {
      var name1, ref1;
      if (4 === xhr.readyState) {
        if ((ref1 = options.statusCode) != null) {
          if (typeof ref1[name1 = xhr.status] === "function") {
            ref1[name1]();
          }
        }
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 302) {
          return cb(null, xhr);
        } else {
          return cb(xhr);
        }
      }
    };
    return xhr.send(options.data);
  };

  ETagResponse = (function() {
    function ETagResponse(eTag1, data1, status1) {
      this.eTag = eTag1;
      this.data = data1;
      this.status = status1;
    }

    return ETagResponse;

  })();

  Request = function(clientOptions) {
    var _cachedETags, cacheHandler, emitter;
    if (clientOptions == null) {
      clientOptions = {};
    }
    if (clientOptions.rootURL == null) {
      clientOptions.rootURL = 'https://api.github.com';
    }
    if (clientOptions.useETags == null) {
      clientOptions.useETags = true;
    }
    if (clientOptions.usePostInsteadOfPatch == null) {
      clientOptions.usePostInsteadOfPatch = false;
    }
    emitter = clientOptions.emitter;
    _cachedETags = {};
    cacheHandler = clientOptions.cacheHandler || {
      get: function(method, path) {
        return _cachedETags[method + " " + path];
      },
      add: function(method, path, eTag, data, status) {
        return _cachedETags[method + " " + path] = new ETagResponse(eTag, data, status);
      }
    };
    return function(method, path, data, options, cb) {
      var ajaxConfig, auth, headers, mimeType;
      if (options == null) {
        options = {
          raw: false,
          isBase64: false,
          isBoolean: false,
          contentType: 'application/json'
        };
      }
      if (options == null) {
        options = {};
      }
      if (options.raw == null) {
        options.raw = false;
      }
      if (options.isBase64 == null) {
        options.isBase64 = false;
      }
      if (options.isBoolean == null) {
        options.isBoolean = false;
      }
      if (options.contentType == null) {
        options.contentType = 'application/json';
      }
      if (method === 'PATCH' && clientOptions.usePostInsteadOfPatch) {
        method = 'POST';
      }
      if (!/^http/.test(path)) {
        path = "" + clientOptions.rootURL + path;
      }
      mimeType = void 0;
      if (options.isBase64) {
        mimeType = 'text/plain; charset=x-user-defined';
      }
      headers = {
        'Accept': clientOptions.acceptHeader || DEFAULT_HEADER(path)
      };
      if (options.raw) {
        headers['Accept'] = 'application/vnd.github.raw';
      }
      if (userAgent) {
        headers['User-Agent'] = userAgent;
      }
      if (cacheHandler.get(method, path)) {
        headers['If-None-Match'] = cacheHandler.get(method, path).eTag;
      } else {
        headers['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
      }
      if (clientOptions.token || (clientOptions.username && clientOptions.password)) {
        if (clientOptions.token) {
          auth = "token " + clientOptions.token;
        } else {
          auth = 'Basic ' + base64encode(clientOptions.username + ":" + clientOptions.password);
        }
        headers['Authorization'] = auth;
      }
      ajaxConfig = {
        url: path,
        type: method,
        contentType: options.contentType,
        mimeType: mimeType,
        headers: headers,
        processData: false,
        data: !options.raw && data && JSON.stringify(data) || data,
        dataType: !options.raw ? 'json' : void 0
      };
      if (options.isBoolean) {
        ajaxConfig.statusCode = {
          204: (function(_this) {
            return function() {
              return cb(null, true);
            };
          })(this),
          404: (function(_this) {
            return function() {
              return cb(null, false);
            };
          })(this)
        };
      }
      if (emitter != null) {
        emitter.emit('start', method, path, data, options);
      }
      return ajax(ajaxConfig, function(err, val) {
        var converted, discard, eTag, eTagResponse, emitterRate, href, i, j, jqXHR, json, k, len, links, part, rateLimit, rateLimitRemaining, rateLimitReset, ref, ref1, ref2, rel;
        jqXHR = err || val;
        if (emitter) {
          rateLimit = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Limit'));
          rateLimitRemaining = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Remaining'));
          rateLimitReset = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Reset'));
          emitterRate = {
            rate: {
              remaining: rateLimitRemaining,
              limit: rateLimit,
              reset: rateLimitReset
            }
          };
          if (jqXHR.getResponseHeader('X-OAuth-Scopes')) {
            emitterRate.scopes = jqXHR.getResponseHeader('X-OAuth-Scopes').split(', ');
          }
          emitter.emit('request', emitterRate, method, path, data, options, jqXHR.status);
        }
        if (!err) {
          if (jqXHR.status === 304) {
            if (clientOptions.useETags && cacheHandler.get(method, path)) {
              eTagResponse = cacheHandler.get(method, path);
              return cb(null, eTagResponse.data, eTagResponse.status, jqXHR);
            } else {
              return cb(null, jqXHR.responseText, status, jqXHR);
            }
          } else if (jqXHR.status === 302) {
            return cb(null, jqXHR.getResponseHeader('Location'));
          } else if (!(jqXHR.status === 204 && options.isBoolean)) {
            if (jqXHR.responseText && ajaxConfig.dataType === 'json') {
              data = JSON.parse(jqXHR.responseText);
              links = jqXHR.getResponseHeader('Link');
              ref = (links != null ? links.split(',') : void 0) || [];
              for (j = 0, len = ref.length; j < len; j++) {
                part = ref[j];
                ref1 = part.match(/<([^>]+)>;\ rel="([^"]+)"/), discard = ref1[0], href = ref1[1], rel = ref1[2];
                data[rel + "_page_url"] = href;
              }
            } else {
              data = jqXHR.responseText;
            }
            if (method === 'GET' && options.isBase64) {
              converted = '';
              for (i = k = 0, ref2 = data.length; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
                converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
              }
              data = converted;
            }
            if (method === 'GET' && jqXHR.getResponseHeader('ETag') && clientOptions.useETags) {
              eTag = jqXHR.getResponseHeader('ETag');
              cacheHandler.add(method, path, eTag, data, jqXHR.status);
            }
            return cb(null, data, jqXHR.status, jqXHR);
          }
        } else {
          if (options.isBoolean && jqXHR.status === 404) {

          } else {
            err = new Error(jqXHR.responseText);
            err.status = jqXHR.status;
            if (jqXHR.getResponseHeader('Content-Type') === 'application/json; charset=utf-8') {
              if (jqXHR.responseText) {
                json = JSON.parse(jqXHR.responseText);
              } else {
                json = '';
              }
              err.json = json;
            }
            return cb(err);
          }
        }
      });
    };
  };

  module.exports = Request;

}).call(this);

},{"./grammar":3,"./helper-base64":4}],11:[function(require,module,exports){
(function() {
  var URL_TESTER, URL_VALIDATOR, injectVerbMethods, toPromise, toQueryString,
    slice = [].slice;

  URL_VALIDATOR = require('./grammar').URL_VALIDATOR;

  toPromise = require('./helper-promise').toPromise;

  toQueryString = require('./helper-querystring');

  URL_TESTER = function(path) {
    var err;
    if (!URL_VALIDATOR.test(path)) {
      err = "BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=" + path;
      return console.warn(err);
    }
  };

  injectVerbMethods = function(request, path, obj) {
    var results, verbFunc, verbName, verbs;
    verbs = {
      fetch: function(cb, config) {
        return request('GET', "" + path + (toQueryString(config)), null, {}, cb);
      },
      read: function(cb, config) {
        return request('GET', "" + path + (toQueryString(config)), null, {
          raw: true
        }, cb);
      },
      readBinary: function(cb, config) {
        return request('GET', "" + path + (toQueryString(config)), null, {
          raw: true,
          isBase64: true
        }, cb);
      },
      remove: function(cb, config) {
        return request('DELETE', path, config, {
          isBoolean: true
        }, cb);
      },
      create: function(cb, config, isRaw) {
        return request('POST', path, config, {
          raw: isRaw
        }, cb);
      },
      update: function(cb, config) {
        return request('PATCH', path, config, null, cb);
      },
      add: function(cb, config) {
        return request('PUT', path, config, {
          isBoolean: true
        }, cb);
      },
      contains: function() {
        var args, cb;
        cb = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return request('GET', path + "/" + (args.join('/')), null, {
          isBoolean: true
        }, cb);
      }
    };
    results = [];
    for (verbName in verbs) {
      verbFunc = verbs[verbName];
      results.push((function(verbName, verbFunc) {
        return obj[verbName] = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          URL_TESTER(path);
          return toPromise(verbFunc).apply(null, args);
        };
      })(verbName, verbFunc));
    }
    return results;
  };

  module.exports = injectVerbMethods;

}).call(this);

},{"./grammar":3,"./helper-promise":5,"./helper-querystring":6}],12:[function(require,module,exports){
module.exports = require('./dist/node/octokat');

},{"./dist/node/octokat":7}]},{},[1]);
