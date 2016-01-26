#!/usr/bin/env bash

function get_users_repos() {
    user_to_query=$1
    user_to_query_response=$(curl https://api.github.com/users/$user_to_query/repos)
    echo $user_to_query_response > text_users_repos.txt;
    cat text_users_repos.txt | jq '.' > text_to_json.json
}

