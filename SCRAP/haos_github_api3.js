$('#ghsubmitbtn1').on('click', function(z) {

  var username = $('#ghusername').val();
  var default_username = 'koreahaos';

  if (user_name_entered(username)) {
    display_github_user_data(username);
  }
  else {
    display_github_user_data(default_username);
  }
});

function return_json_object(url, callback) {
  $.ajax({
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}


function display_github_user_data(username_to_querry_api_with) {

  var user_api_string = 'https://api.github.com/users/' + username_to_querry_api_with;
  var user_repos_api_string = 'https://api.github.com/users/' + username_to_querry_api_with + '/repos';

  var return_json_object;
  
  requestJSON(user_api_string, function(return_json_object) {

    if (return_json_object.message == "Not Found") {
      display_user_info("<h2>No User Info Found</h2>");
    }
    else {
      display_user_info("<h2>User Info Found</h2>");
      
      var user_info_tester = "";
      
      display_user_info("<h2>User Info Found</h2>");
      } // end else statement
  }); // end requestJSON Ajax call
}

function display_user_info(string_to_display){
  $('#ghapidata1').html(string_to_display);
}



/*
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
            $.getJSON(user_repos_branches_api_string, function(json) {
              branches = json;
              outhtml += " X ";
              //console_display_value("----", "repositories[" + index1 + "].name = " + repositories[index1].name);
              //console_display_value("R"+index1+"--- ", repositories[index1].name);
              $.each(branches, function(index2) {
                //console_display_value("  |---", "branches[" + index2 + "].name = " + branches[index2].name);
                //console_display_value("   |---b" + index2 + "- ", branches[index2].name);
                if (branches[index2].name == "gh-pages") {
                  //outhtml += '<h1>HAS GH_PAGES<h1>';
                  //console_display_value("GH_PAGES!", " true");
                } else {
                  
                }
              });
            });
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
$('#ghsubmitbtn2').on('click', function(z) {

  var username = $('#ghusername').val();
  var default_username = 'koreahaos';

  if (user_name_entered(username)) {
    display_github_user_pretty(username);
  }
  else {
    display_github_user_pretty(default_username);
  }
});

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

function requestJSON(url, callback) {
  $.ajax({
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}

function user_name_entered(value_in) {
  return Boolean(value_in != "");
}

$('#ghsubmitbtn3').on('click', function(z) {
  location.reload();
});

function display_alert() {
  alert("Hello!");
}

function display_alert(val_in) {
  alert("val_in = " + val_in);
}

function console_display_value(val_in) {
  console.log("val_in = " + val_in);
}

function console_display_value(predecessor_string, val_in) {
  console.log(predecessor_string + val_in);
}

function console_display_json(json_in) {
  console.log(json_in);
}

function console_display_json(name, json_in) {
  console.log(name);
  console.log(json_in);
}
