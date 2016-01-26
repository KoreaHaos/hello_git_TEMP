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
