```
      ___ ___         .__  .__          
     /   |   \   ____ |  | |  |   ____  
    /    ~    \_/ __ \|  | |  |  /  _ \ 
    \    Y    /\  ___/|  |_|  |_(  <_> )
     \___|_  /  \___  >____/____/\____/ 
           \/       \/                  
       
  ________.__  __     ___ ___      ___.    
 /  _____/|__|/  |_  /   |   \ __ _\_ |__  
/   \  ___|  \   __\/    ~    \  |  \ __ \ 
\    \_\  \  ||  |  \    Y    /  |  / \_\ \
 \______  /__||__|   \___|_  /|____/|___  /
        \/                 \/           \/ 

           _____ __________.___  ._.
          /  _  \\______   \   | | |
         /  /_\  \|     ___/   | | |
        /    |    \    |   |   |  \|
        \____|__  /____|   |___|  __
                \/                \/
```

#### The script:

```bash
# Use node package manager to install request

npm install request

# Use node package manager to install github-api

npm install github-api

# Use node package manager to install browserify

npm install -g browserify

# Create a directory structure.

mkdir pgs
mkdir js

# Create a javascript file.
# Source (heavily modified...) : https://github.com/request/request

cat > js/main.js << EOF
var user;

var request = require('request');
var github_user_id = ""

if(github_user_id == ""){
  github_user_id = prompt("Enter GitHub user name to querry : ");
}


request('https://api.github.com/users/' + github_user_id, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    user = body;
    console.log("NO ERROR.");
  } else {
    console.log(error);
    console.log("ERROR!");
  }
});

function console_show_user_info() {
  console.log("console_show_user_info() called");
  console.log(user);
}

document.getElementById("ghUserInfoButton").onclick = console_show_user_info;
EOF

# Create a html file to demo the example

cat > pgs/index.html << EOF
<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML>

<HEAD>
   <TITLE>
      Example 1 - Hello Node Request
   </TITLE>
</HEAD>

<BODY>
   <H1>Hello Node Request</H1>

   <P>A simple example of the Node.js <a href="https://www.npmjs.com/package/request" target="_blank">Request</a> package</P>

   <p>Open your browser's dev console and then press the button</p>

   <input id="ghUserInfoButton" type="button" value="get user's GitHub info" />

   <script src="../js/bundle.js"></script>
</BODY>

</HTML>
EOF

# Create a html file to link to the hello world example. 

cat > index.html << EOF
<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML>

<HEAD>
   <TITLE>
      Hello Node Request
   </TITLE>
</HEAD>

<BODY>
   <H1>Hello Node Request</H1>
   <P>A simple example of the Node.js <a href="https://www.npmjs.com/package/request" target="_blank">Request</a> package</P>
   <ul>
      <li>  
         <a href="pgs/index.html" target="_blank">Example One</a></li>
   </ul>
</HTML>
EOF

# Use browserify to create a javascript file that includes all the node modules.

browserify js/main.js -o js/bundle.js

# Thats it.
```
