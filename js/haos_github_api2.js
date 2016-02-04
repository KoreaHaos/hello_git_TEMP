$('#basicDataButton').on('click', function(wtf_is_this) {

  update_dom();
  get_basic_user_data();
});

function get_basic_user_data() {
  console_display_value("Getting data for : " + default_username + ".");
}


function update_dom() {
  
  var user_dom_should_work_with = $('#ghusername').val();
  
  if (user_dom_should_work_with) {
    client_modded_default = true;
  }
  // manage the text input field.
  
  console.log("// if we have no text in the input field and no default set,");
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
      update_default_user(user_dom_should_work_with);
    
  }
  // else if we have text in the input field and a default already set,"
  else if (user_dom_should_work_with && default_username) {
    
    // We should see if there is any change and if there is,"
    if (!(user_dom_should_work_with === default_username)) {
      update_default_user(user_dom_should_work_with);
    } 
  }
  else {
    update_default_user(user_dom_should_work_with);
  }
  update_input_text_field(user_dom_should_work_with);
  
  if (user_dom_should_work_with) {
    
  }
  
  update_api_calls_remain_view();
  
  //update
  console.log("num_of_actions_client_actioned = " + num_of_actions_client_actioned);
  num_of_actions_client_actioned++;
  console_display_value("update_dom is done!");
}

function update_default_user(user_dom_should_work_with){
  console_display_value("update_default_user called!")

  // update the global variable.
  default_username = user_dom_should_work_with;
  
  var basic_github_user_api_string = "https://api.github.com/users/";
  var url_to_call = basic_github_user_api_string + default_username;
  
  console_display_value("url_to_call = " + url_to_call);
  
  requestJSON(url_to_call, function(json) {
    var basic_user_data_html_string = "NOT_SET";
    var error_string="update_dom() could not get github_rate_limit_url_string"
    
    if (json.message == "Not Found") {
      basic_user_data_html_string = error_string;
      console_display_value(error_string);
    }
    else {
      // HERERERERER
      //var calls_remain = json.resources.core.remaining;
      //console_display_value("calls_remain = " + calls_remain);
      default_user_object=json;
      //basic_user_data_html_string = "<p id=\"basicData\"> API calls remaining : " + calls_remain + " </p>";
    }
  //default_user_object
  
  //$('#basicGitHubAPIdata').html(basic_user_data_html_string);
  console_display_value("HELLO!")
  console_display_value(json);
  console_display_value(default_user_object);
  update_basic_user_data_view();
  console_display_value("GOODBYE!")
  });
}

function update_basic_user_data_view() {
  console_display_value("HELLO update_basic_user_data_view!")
  // <a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>'
  //var innerHTML = "<img src=\"https://avatars.githubusercontent.com/u/14045324?v=3\" width=\"80\" height=\"80\"></a>";
  
  var fullname   = default_user_object.name;
  var username   = default_user_object.login;
  
  var users_email = default_user_object.email;
  
  if(fullname == undefined) { fullname = username; }
  if(users_email === "null") {users_email = default_user_object.html_url }
  
  var innerHTML = "";
  innerHTML += "<div>";
  innerHTML += "<h2>"+ default_user_object.name;
  
  innerHTML += '<span class="smallname">(@<a href="' + default_user_object.email + '" target="_blank">';
  innerHTML += default_user_object.name + '</a>)</span></h2>';
  innerHTML += '<div class="ghcontent">'
  innerHTML += '<div class="avi">'
  innerHTML += '<a href="' + default_user_object.html_url + '" target="_blank">'
  innerHTML += '<img src="' + default_user_object.avatar_url + '" width="80" height="80" alt="' + fullname + '"></a></div>';
  innerHTML += '<p>Public Repos : ' + default_user_object.public_repos + '</p>'
  innerHTML += '<p>Public Gists : ' + default_user_object.public_gists + '</p>'
  innerHTML += '</div></div><br></br>';
  

  
  innerHTML += "";
  //innerHTML += "<img src=\"" + default_user_object.avatar_url + "\" width=\"80\" height=\"80\"></a>";
  innerHTML += "";
  innerHTML += "";
  innerHTML += "";
  innerHTML += "";

  $('#basicGitHubUSERdata').html(innerHTML);
  console_display_value("in the middle update_basic_user_data_view!")
  console_display_value("GOODBYE update_basic_user_data_view!")
}

function update_input_text_field(user_to_work_with) {
  if (user_to_work_with) {
    document.getElementsByName('ghusername')[0].placeholder='Enter a GitHub username here. Default : ' + user_to_work_with;
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
      // HERERERERER
      var calls_remain = json.resources.core.remaining;
      console_display_value("calls_remain = " + calls_remain);
      basicGitHubAPIrateString = "<p id=\"basicData\"> API calls remaining : " + calls_remain + " </p>";
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
var default_username = "KoreaHaos";
var default_user_object;

update_dom();


/* ToDo Fix this!

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