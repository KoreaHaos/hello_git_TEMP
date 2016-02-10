$('#basicDataButton').on('click', function(wtf_is_this) {
  update_dom();
});

function update_dom() {
  
  // ToDo Figure out what needs to be done to clean any input and make it safe/secure.
  
  var user_dom_should_work_with = $('#ghusername').val();
  
  // If the user/client has entered text in the field, we note that.
  if (user_dom_should_work_with) {
    client_modded_default = true;
  }
  
  // Then this part of the code manages the text input field.
  
  // if we have no text in the input field and no default set,
  if (!user_dom_should_work_with && !default_username) {
    // the user has not set a GitHub user to query.
  }
  // else, if we have no text in the input field but a default is set,
  else if (!user_dom_should_work_with && default_username) {
    // we use the default;
    user_dom_should_work_with = default_username;
    // If it's the first load on the browser, do nothing.
    // If it's the second load and the original default has not been modded,
    if(num_of_actions_client_actioned == 1 && !client_modded_default)
      get_basic_user_data(user_dom_should_work_with);
  }
  // else if we have text in the input field and a default already set,"
  else if (user_dom_should_work_with && default_username) {
    
    // We should see if there is any change and if there is,"
    if (!(user_dom_should_work_with === default_username)) {
      get_basic_user_data(user_dom_should_work_with);
    } 
  }
  else {
    get_basic_user_data(user_dom_should_work_with);
  }
  
  // Clear the text field and change the placeholder.
  update_input_text_field(user_dom_should_work_with);
  
  // Let the user know how many calls they have left.
  update_api_calls_remain_view();
  
  num_of_actions_client_actioned++;
}

function get_basic_user_data(user_dom_should_work_with){
  // update the global variable.
  default_username = user_dom_should_work_with;
  
  var basic_github_user_api_string = "https://api.github.com/users/";
  var url_to_call = basic_github_user_api_string + default_username;
  
  requestJSON(url_to_call, function(json) {
    var basic_user_data_html_string = "NOT_SET";
    var error_string="update_dom() could not get github_rate_limit_url_string"
    
    if (json.message == "Not Found") {
      basic_user_data_html_string = error_string;
      console_display_value(error_string);
    }
    else {
      default_user_object=json;
    }
  update_basic_user_data_view();
  });
}

function update_basic_user_data_view() {

  var fullname   = default_user_object.name;
  var username   = default_user_object.login;
  var users_email = default_user_object.email;
  
  if(fullname == undefined) { fullname = username; }
  if(users_email === "null") {users_email = default_user_object.html_url }
  
  var innerHTML = "";
  innerHTML += '<div>';
  innerHTML += '<h2>';
  innerHTML += default_user_object.name;
  innerHTML += '<span class="smallname">(@<a href="' + default_user_object.email + '" target="_blank">';
  innerHTML += default_user_object.name + '</a>)</span>';
  innerHTML += '</h2>';
  innerHTML += '<div class="ghcontent">'
  innerHTML += '<div class="avi">'
  innerHTML += '<a href="' + default_user_object.html_url + '" target="_blank">'
  innerHTML += '<img src="' + default_user_object.avatar_url + '" width="80" height="80" alt="' + fullname + '">';
  innerHTML += '</a>';
  innerHTML += '</div>';
  innerHTML += '<p>'
  innerHTML += 'Public Repos : ' + default_user_object.public_repos;
  innerHTML += '</br>'
  innerHTML += 'Public Gists : ' + default_user_object.public_gists;
  innerHTML += '</p>';
  innerHTML += '</div>';
  innerHTML += '</div>';
  innerHTML += '<br>';
  innerHTML += '</br>';
  
  $('#basicGitHubUSERdata').html(innerHTML);
}

function update_input_text_field(user_to_work_with) {
  if (user_to_work_with) {
    if (client_modded_default) {
      document.getElementsByName('ghusername')[0].placeholder=user_to_work_with;
      
    } else {
      document.getElementsByName('ghusername')[0].placeholder='Enter a GitHub username here. Default : ' + user_to_work_with;
    }
  } else {
    document.getElementsByName('ghusername')[0].placeholder='Enter a GitHub username here.';
  }
  clear_input_field();
}

function clear_input_field() {
  document.getElementById('ghusername').value='';
}

function update_api_calls_remain_view() {
  
  var github_rate_limit_url_string = 'https://api.github.com/rate_limit';
  
  requestJSON(github_rate_limit_url_string, function(json) {
  
    var basicGitHubAPIrateString = "NOT_SET";
    var error_string="update_dom() could not get github_rate_limit_url_string"
    
    if (json.message == "Not Found") {
      basicGitHubAPIrateString = error_string;
      console_display_value(error_string);
    }
    else {
      var calls_remaining = json.resources.core.remaining;
      basicGitHubAPIrateString = "<p id=\"basicData\"> API calls remaining : " + calls_remaining + " </p>";
    }
  $('#basicGitHubAPIdata').html(basicGitHubAPIrateString);
  });
}

function console_display_value(val_in) {
  console.log(val_in);
}

// This was the bit copied that i still need to figure out more fully.
// ToDo Figure this out!

function requestJSON(url, callback) {
  $.ajax({
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}

// A basic reset on the app, clears default user.
$('#resetButton').on('click', function(wtf_is_this) {
  location.reload();
});

var num_of_actions_client_actioned = 0;
var client_modded_default = false;
var default_username = "EntropyHaos";
var default_user_object;

update_dom();


/*
    //   ) )                                        /__  ___/ ||   / |  / / //   ) ) 
   //___/ /         __  ___ __  ___  ___       __     / /     ||  /  | / / //   / /  
  / __  (   //   / / / /     / /   //   ) ) //   ) ) / /      || / /||/ / //   / /   
 //    ) ) //   / / / /     / /   //   / / //   / / / /       ||/ / |  / //   / /    
//____/ / ((___( ( / /     / /   ((___/ / //   / / / /        |  /  | / ((___/ /     
*/


// ToDo Fix this!

$('#GitHubPagesButton').on('click', function(wtf_is_this) {


  // console.log(default_user_object);
  manage_user_input_field();
  // If the data object is not populated but we have a default username,
  if (!default_user_object && default_username) {
    build_default_user_object(populate_pages_data);
    $('#githubPagesData').html('<div id="loader"><img src="../gifs/waiting_black.gif" alt="loading..."></div>');
  } else {
    if(we_need_to_update_default_user_object()) {
      build_default_user_object(populate_pages_data);
    $('#githubPagesData').html('<div id="loader"><img src="../gifs/waiting_black.gif" alt="loading..."></div>');
    }
  }
  //console.log(default_user_object);
});

function populate_pages_data(data_to_populate_default_user_object_with) {
  //console.log("populate_pages_data() called!");
  //console_display_value(default_user_object);
  //console_display_value(data_to_populate_default_user_object_with);
  default_user_object = data_to_populate_default_user_object_with;
  
  var num_of_repos_to_call_for = default_user_object.public_repos;
  
  if (num_of_repos_to_call_for > 100) {
    num_of_repos_to_call_for = 100;
    console.log("MORE THAN 100 REPOS!");
  }
  
  var github_users_repos_api_string = default_user_object.repos_url;
  var pagination_concatination_string = "?per_page=" + num_of_repos_to_call_for;
  var error_string="populate_pages_data() API call failed!";
  
  var url_to_call = github_users_repos_api_string + pagination_concatination_string;
  
  requestJSON(url_to_call, function(json_returned) {
    if (json_returned.message == "Not Found") {
      console_display_value(error_string);
    }
    else {
      //default_user_object=json;
      default_user_object.repos_api_data = json_returned;
      for(var i = 0; i < default_user_object.repos_api_data.length; i++) {
        //console_display_value(default_user_object.repos_api_data[i].name);
        if (default_user_object.repos_api_data[i].has_pages){
          var github_pages_url_string = "http://" + default_user_object.login + ".github.io/" + default_user_object.repos_api_data[i].name;
          //console_display_value(github_pages_url_string);
          default_user_object.repos_api_data[i].repos_pages_url = github_pages_url_string;
        }
      }
    }
    console_display_value(default_user_object);
    $('#githubPagesData').html(make_github_pages_html_from_default_user_object());
  });
}

function make_github_pages_html_from_default_user_object() {
  
  //var 
  
  var return_html_string = "";
  return_html_string += "";
  return_html_string += '<div class="repolist">';
  return_html_string += "<ul>";
  
  for(var i = 0; i < default_user_object.repos_api_data.length; i++) {
    return_html_string += '<div><li>';
    return_html_string += '<a href = "';
    return_html_string += default_user_object.repos_api_data[i].html_url;
    return_html_string += '" target="_blank">'
    return_html_string += default_user_object.repos_api_data[i].name;
    return_html_string += '</a>'
    //return_html_string += '</li>';
    if (default_user_object.repos_api_data[i].has_pages){
      //return_html_string += '<div id="pages_icon">';
      return_html_string += '<li>';
      return_html_string += '<a href = "';
      return_html_string += default_user_object.repos_api_data[i].repos_pages_url;
      return_html_string += '" target="_blank">'
      return_html_string += '<img style="width:21px;height:21px;border:0" src="../img/star.jpg" alt="gh-pages link">'
      return_html_string += '</a>'
      return_html_string += '</li>';
      //return_html_string += "<br></br>";
      //return_html_string += "</div>";
    }
    return_html_string += "</li></div>";
  }
  return_html_string += "</ul>";
  return_html_string += "</div>";
  
  return return_html_string;
}

// ToDo This is not need for the static web app! Add it in when data gets cached.
// This variable decleration parses the branches_url to just the url.
// var github_users_repos_branches_api_string = default_user_object.repos_api_data[i].branches_url.replace(/\{.*?\}/g, '');
/*
function insert_branches_data_into_object(name_of_repo_to_get_branch_data_for, repos_branches_api_string) {
  
  var repo_to_attache_data_to = name_of_repo_to_get_branch_data_for;
  var error_string = "insert_branches_data_into_object error!";
  
  requestJSON(repos_branches_api_string, function(json_returned) {
    if (json_returned.message == "Not Found") {
      console_display_value(error_string);
    }
    else {
      console_display_value(json_returned);
      
    }

  });
}
*/
function build_default_user_object(function_to_call_once_user_object_is_built){
  // This function updates the global variable 'default_user_object'.

  var basic_github_user_api_string = "https://api.github.com/users/";
  var url_to_call = basic_github_user_api_string + default_username;

  var error_string="build_default_user_object() API call failed!";
  
  requestJSON(url_to_call, function(json_returned) {
    if (json_returned.message == "Not Found") {
      console_display_value(error_string);
    }
    else {
      //default_user_object=json;
    }
    //console_display_value(default_user_object);
    //console.log("populate_pages_data() is being called!");
    // ToDo move this up into if/else block.
    function_to_call_once_user_object_is_built(json_returned);
  //update_basic_user_data_view();
  });
}


function we_need_to_update_default_user_object() {
  //console.log(default_user_object);
  
  if (default_username.toUpperCase() === default_user_object.login.toUpperCase()) {
    return false;
  } else {
    console.log("default_username has been modidied.");
    return true;
  }
}

function manage_user_input_field() {
  
  // ToDo Figure out what needs to be done to clean any input and make it safe/secure.
  var user_dom_should_work_with = $('#ghusername').val();
  //console.log("A - user_dom_should_work_with = " + user_dom_should_work_with);
  //console.log("A - default_username = " + default_username);
  
  // If the user/client has entered text in the field, we note that.
  if (user_dom_should_work_with) {
    client_modded_default = true;
  }
  
  if (user_dom_should_work_with && default_username) {
    // We should see if there is any change and if there is,"
    if (!(user_dom_should_work_with === default_username)) {
      //console.log("Change observed");
      default_username = user_dom_should_work_with;
    } else {
      //console.log("NO NO NO ! Change observed");
    }
  } else if (user_dom_should_work_with && !default_username) {
    default_username = user_dom_should_work_with;
  }
  
  
  //console.log("B - user_dom_should_work_with = " + user_dom_should_work_with);
  //console.log("B - default_username = " + default_username);
  
  update_input_text_field(default_username);
}

// ToDo Remove this scrap!

/*
$('#GitHubPagesButton').on('click', function(wtf_is_this) {
  var username = $('#ghusername').val();
  var default_username = 'koreahaos';

  if (user_name_entered(username)) {
    display_github_user_pretty(username);
  }
  else {
    display_github_user_pretty(default_username);
  }
});
  */


/* ToDo make sure there is no use for any of this...

function get_current_user_being_queried_html_string(user_being_queried) {
  
  var returnString = "<p>Enter a user name.</p>";
  
  if (user_being_queried) {
    returnString = "<p>User being queried = " + user_being_queried + " </p>"
  } else {
    //returnString = "<p>User being queried = " + user_being_queried + " </p>";
  }
  return returnString;
}
*/

/* ToDo Make this right!

function display_github_user_data(username_to_querry_api_with) {

  var user_api_string = 'https://api.github.com/users/' + username_to_querry_api_with;
  var user_repos_api_string = 'https://api.github.com/users/' + username_to_querry_api_with + '/repos';

  var return_json_object;

  requestJSON(user_api_string, function(json) {
    if (json.message == "Not Found") {
      $('#ghapidata1').html("<h2>No User Info Found</h2>");
    }

    else {
      // else we have a user and we display their info
      var num_of_repos = json.public_repos;

      var outhtml = "";
      outhtml += '<p>';
      outhtml += '<strong>Num of Repos: ' + num_of_repos + '</strong><br>';

      var repositories;
      $.getJSON(user_repos_api_string, function(json) {
        repositories = json;
        outputPageContent();
      });

      function outputPageContent() {
        if (repositories.length == 0) {
          outhtml += 'No repos!';
        }
        else {
          outhtml += '<strong>Repo List:</strong>';
          outhtml += '<ul style="font-size:100%">';
          $.each(repositories, function(index1) {
            outhtml += '<li style="font-size:20px"><a href="' + repositories[index1].html_url + '" target="_blank">' + repositories[index1].name + '</a></li>';
            var user_repos_branches_api_string = "https://api.github.com/repos/" + username_to_querry_api_with + "/" + repositories[index1].name + "/branches";
            var branches;
            outhtml += " x ";
            $.getJSON(user_repos_branches_api_string, function(json) {
              branches = json;
              //console_display_value("----", "repositories[" + index1 + "].name = " + repositories[index1].name);
              console_display_value("R" + index1 + "--- ", repositories[index1].name);
              $.each(branches, function(index2) {
                outhtml += " Z ";
                //console_display_value("  |---", "branches[" + index2 + "].name = " + branches[index2].name);
                console_display_value("   |---b" + index2 + "- ", branches[index2].name);
                if (branches[index2].name == "gh-pages") {
                  //outhtml += '<h1>HAS GH_PAGES<h1>';
                  console_display_value("GH_PAGES!", " true");
                }
                else {

                }
              });

            });
            outhtml += " X ";
          });
          outhtml += '</ul>';
          outhtml += '</p></div>';
        }
        $('#ghapidata1').html(outhtml);
      } // end outputPageContent()
    } // end else statement
  }); // end requestJSON Ajax call

  return return_json_object;
}

*/

/* ToDo Make this right!

/*
function display_github_user_pretty(username_to_querry_api_with) {

  var user_api_string = 'https://api.github.com/users/' + username_to_querry_api_with;
  var user_repos_api_string = 'https://api.github.com/users/' + username_to_querry_api_with + '/repos';

  requestJSON(user_api_string, function(json) {
    if (json.message == "Not Found") {
      $('#ghapidata2').html("<h2>No User Info Found</h2>");
    }

    else {
      // else we have a user and we display their info
      var fullname = json.name;
      var username = json.login;
      var aviurl = json.avatar_url;
      var profileurl = json.html_url;
      var followersnum = json.followers;
      var followingnum = json.following;
      var num_of_repos = json.public_repos;

      if (fullname == undefined) {
        fullname = username;
      }

      var outhtml = "";
      outhtml += '<h2>' + fullname + ' <span class="smallname">(@<a href="' + profileurl + '" target="_blank">' + username + '</a>)</span></h2>';
      outhtml += '<div class="ghcontent"><div class="avi"><a href="' + profileurl + '" target="_blank"><img src="' + aviurl + '" width="80" height="80" alt="' + username + '"></a></div>';
      outhtml += '<p>Followers: <strong>' + followersnum + '</strong>';
      outhtml += '<br>Following: <strong>' + followingnum + '</strong>';
      outhtml += '<br>Repos: <strong>' + num_of_repos + '</strong></p></div>';
      outhtml += '<div class="repolist clearfix">';

      var repositories;
      $.getJSON(user_repos_api_string, function(json) {
        repositories = json;
        outputPageContent();
      });

      function outputPageContent() {
        if (repositories.length == 0) {
          outhtml = outhtml + '<p>No repos!</p></div>';
        }
        else {
          outhtml = outhtml + '<p><strong> Repo List:</strong></p> <ul>';
          $.each(repositories, function(index) {
            outhtml = outhtml + '<li><a href="' + repositories[index].html_url + '" target="_blank">' + repositories[index].name + '</a></li>';
          });
          outhtml = outhtml + '</ul></div>';
        }
        $('#ghapidata2').html(outhtml);
      } // end outputPageContent()
    } // end else statement
  }); // end requestJSON Ajax call
}

*/