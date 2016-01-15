require 'octokit'

# Fetch a user
user = Octokit.user 'KoreaHaos'
puts user.name
# => "John Barnette"
puts user.fields
# => <Set: {:login, :id, :gravatar_id, :type, :name, :company, :blog, :location, :email, :hireable, :bio, :public_repos, :followers, :following, :created_at, :updated_at, :public_gists}>
puts user[:company]
# => "GitHub"
puts user.rels[:gists].href
# => "https://api.github.com/users/jbarnette/gists"
