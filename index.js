const express = require('express')
const app = express()
const axios = require('axios')
var cors = require('cors');

app.use(cors({origin: '*'}));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

const gitClientID = 'b778bba91a8eca85ea24'
const gitClientSecret = '71651d725d05d5dd1483e3d1d76813e37790ac7d'
const googleClientId = '440498918071-r7fpglmoi8624jcfjrualo5ac9uq38m9.apps.googleusercontent.com'
const googleClientSecret='svmIGd1XKqUQR6qZW1mHkL3F'

app.get('/google/callback', (req, res)=>{

    axios({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        method: 'post',
        params: {
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: 'http:/localhost:4000/google/callback.html',
          grant_type: 'authorization_code',
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch(function(err) {
        console.log(err.response.data);
      });

})


app.get('/github/callback', (req, res)=>{

    const requestToken = req.query.code

    axios({
        method:'post',
        url: `https://github.com/login/oauth/access_token?client_id=${gitClientID}&client_secret=${gitClientSecret}&code=${requestToken}`,   
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {

        const accessToken = response.data.access_token

        console.log(response.data)
        
        res.redirect(`http://localhost:3000/repositories?access_token=${accessToken}`)

    })

})


app.use(express.static(__dirname + '/public'))
app.listen(4000,()=>{
    console.log("Server listening on port : 4000")
})