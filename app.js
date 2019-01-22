
var db = firebase.firestore();
const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
}



//   var cache = new Array();

// if (localStorage.getItem('uid')) {
//   for (var a = 0; a < catagoriesArray.length; a++) {
//     firebase.firestore().collection('Favorite').doc(localStorage.getItem('uid')).collection(catagoriesArray[a]).get()
//       .then(docs => {
//         docs.forEach(elems => {
//           cache.push(elems.data());
//         })
//       })
//   }
// }

setTimeout(function () {
  var JSONReadyFav = JSON.stringify(cache);
  localStorage.setItem('myFavs', JSONReadyFav);
}, 5000);

var JSONParseFav = JSON.parse(localStorage.getItem('myFavs'));

window.addEventListener('load', function(e) {
    if (navigator.onLine) {
      console.log('You are online!');
    } else {
        alert("You Are Offline" )
    }
  }, false);
  
  window.addEventListener('online', function(e) {
   
    alert("You Are Online" )
  }, false);
  
  window.addEventListener('offline', function(e) {
       alert("You Are Offline" )
  }, false);

function signUp() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log(email, password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (res) {
       
        console.log('res =>', res.user.uid);
        messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
                return messaging.getToken()
            }).then(function(currentToken) {

                var tokenid = currentToken

                db.collection('users').doc(res.user.uid).set({ name, email,token: tokenid })
                
                    localStorage.setItem('currentToken', currentToken);
                    console.log('currentToken', currentToken);
                    alert('Registered Successfully!');
                    //window.location.assign("dashboard.html");

            }).catch(function(err) {
                alert('Please allow notification to continue');
                console.log('Unable to get permission to notify.', err);
            });

            messaging.onMessage((payload) => {
                console.log('payload', payload)
            });
       
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
        // ...
    });
}

function signIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res)
        console.log(firebase.auth().currentUser.uid)
        messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
                return messaging.getToken()
            }).then(function(currentToken) {

                var tokenid = currentToken

                db.collection('users').doc(res.user.uid).update({ token: tokenid })
                
                    localStorage.setItem('currentToken', currentToken);
                    console.log('currentToken', currentToken);
                    localStorage.setItem('uid', firebase.auth().currentUser.uid);
                    alert("SignIn successfull");
                  //  window.location.assign("dashboard.html");
                    var serviceForm = document.getElementById('service-form');
                    serviceForm.className = "";

            }).catch(function(err) {
                alert('Please allow notification to continue');
                console.log('Unable to get permission to notify.', err);
            });

            messaging.onMessage((payload) => {
                console.log('payload', payload)
            });
       // window.location.assign("dashboard.html");
        
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
        // ...
    });
}

function logout() {


    firebase.auth().signOut()
    .then(function() {
        window.location.assign("index.html");
        console.log(userUid);
        console.log(firebase.auth().currentUser.uid);
    })
    .catch(function(error) {
      console.log(error)
    });

    
}

//check user is signIn or not
function check(){
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location.assign("dashboard.html")
  } else {
    // No user is signed in.
    window.location.assign("logIn.html");
  }
});
}


var url;

function addad() {
    var category = document.getElementById('category').value;
    var title = document.getElementById('title').value;
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var city = document.getElementById('city').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;

    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child("images/ad_"+ Math.random().toString().substring(2,6));
    var file = document.getElementById('imageId').files[0]
    
    if (category == "" || title == "" || name == "" || phone == "" || city == "" || description == "") {
        alert('Please fill all the fields');
    }
    else{

        return new Promise((resolve,reject) =>{
            imagesRef.put(file)
            .then(function(sanpshot){
                imagesRef.getDownloadURL().then(function(url){
                    db.collection('Ads').add({ category, title, name, phone, city, description: description, price: price , url, uid: firebase.auth().currentUser.uid });
                    alert("Add uploaded successfully");
                    console.log('uploaded a file or blob!',sanpshot);
                   // window.location.assign("products.html");
                    Console.log(url);
                    //resolve('url');
                    document.getElementById('category').value = "";
                    document.getElementById('title').value = "";
                    document.getElementById('name').value = "";
                    document.getElementById('phone').value = "";
                    document.getElementById('city').value = "";
                    document.getElementById('category').value = "";

                }).then(res => {
                        console.log('res id***', res.id);
                        //currentRoomId = res.id;
                        localStorage.setItem('Ad_id', res.id);
                        localStorage.setItem('User_id', id);
                        }).catch(function(error){
        
                });
            }).catch((e) => {
                console.log('Error => ', e);
                alert('Error in uploading');
                        
            });
        })
    }



}
   

function search() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var ads;
    ads = document.getElementById('ad');
    //window.location.assign('products.html');
    var search = document.getElementById('search12').value;
    var search1 = search.toLowerCase();
    var center1 = document.createElement('center');
    var heading = document.createElement('h1');
    var hr1 = document.createElement('hr')
   // if (ads == null) {ads.id = "cont";}
    ads.innerHTML ="";
    heading.setAttribute('id', 'heading');
    ads.appendChild(center1);
    center1.appendChild(heading);
    ads.appendChild(hr1);
    heading.innerHTML = search + " Ads";

    if (search1 == search1 ) {
        db.collection("Ads").where("category","==", search1).get().then((res) => {
            res.forEach((doc) => {

            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ads.appendChild(row);
            row.appendChild(div1);
            ads.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');

            });
        });
    }

}

function search1() {
    
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Property Ads";
    db.collection("Ads").where("category","==", "property").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search2() {
    
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Vehicles Ads";
    db.collection("Ads").where("category","==", "vehicles").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}


function search3() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Electronics Ads";
    db.collection("Ads").where("category","==", "electronics").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search4() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Books Ads";
    db.collection("Ads").where("category","==", "books").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search5() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Jobs Ads";
    db.collection("Ads").where("category","==", "jobs").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search6() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Buisness Ads";
    db.collection("Ads").where("category","==", "buisness").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search7() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Beauty Ads";
    db.collection("Ads").where("category","==", "beauty").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search8() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Animals Ads";
    db.collection("Ads").where("category","==", "animals").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}

function search9() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Baby Ads";
    db.collection("Ads").where("category","==", "baby").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
          //  h14.innerHTML = 'UId: '+doc.data().uid;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            });
    });
}





if (window.location.pathname == '/products.html') {
    getServices();
}

   var d = 1;
function getServices() {
    
    var ads = document.getElementById('ads');

    db.collection('Ads').get()
    .then((res) => {
        res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var r = doc.id;
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ads.appendChild(row);
            row.appendChild(div1);
            ads.appendChild(hr);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: '+doc.data().phone;
            h14.innerHTML = 'Price: Rs'+doc.data().price;
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
          
        })
     
        })
     
}
   
function DisplayAdd(id){

    var userid = firebase.auth().currentUser.uid;

   db.collection('Ads').doc(id).get().then(function(doc) {
    
    if (doc.exists) {

                if (doc.data().uid == firebase.auth().currentUser.uid) {
                  
                    var pic = doc.data().url;
                    var modal_title = document.getElementById('modal-title');
                    var modal_body = document.getElementById('modal-body');
                    var modal_image = document.getElementById('modal-image');
                    var modal_send = document.getElementById('modal-send');
                    var fav = document.getElementById('modal-fav');

                    modal_send.setAttribute('onclick', "message('"+doc.id+"')");
                    modal_send.style.display = 'none';
                    fav.style.display = 'none';

                    modal_image.setAttribute('src', pic); 
                                
                    modal_title.innerHTML = doc.data().title;
                    modal_body.innerHTML = "Category: " + doc.data().category + "<br><br>Name: " + doc.data().name + "<br><br>City: " + doc.data().city + "<br><br>Number: " + doc.data().phone 
                    + "<br><br>Price: Rs" + doc.data().price + "<br><br>Description: " + doc.data().description;
                }
                else{
                    var pic = doc.data().url;
                    var modal_title = document.getElementById('modal-title');
                    var modal_body = document.getElementById('modal-body');
                    var modal_image = document.getElementById('modal-image');
                    var modal_send = document.getElementById('modal-send');
                    var modal_fav = document.getElementById('modal-fav');
                    var fav = document.getElementById('modal-fav');
                    var middle = document.getElementById('middle');
                   
                    modal_send.setAttribute('onclick', "message('"+doc.id+"')");
                    modal_fav.setAttribute('onclick', "addToFavorite(this,'"+doc.id+"')");
                    modal_image.setAttribute('src', pic);
                    modal_send.style.display = 'block';
                    fav.style.display = 'block';
                   
                    modal_title.innerHTML = doc.data().title;
                    modal_body.innerHTML = "Category: " + doc.data().category + "<br><br>Name: " + doc.data().name + "<br><br>City: " + doc.data().city + "<br><br>Number: " + doc.data().phone
                    + "<br><br>Price: Rs" + doc.data().price + "<br><br>Description: " + doc.data().description;
                }}
     else {
                        console.log("No such document!");
                    }
                    
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
 
    }

var reciveMessage = document.getElementById("reciveMessage")
var sendMessage = document.getElementById("sendMessage")

    /* Message */
function message(AdId){

       
    localStorage.setItem('AdId',AdId);

    firebase.auth().onAuthStateChanged(function(user) {
       
        if (user) {
            // User is signed in.
            docRef.get().then(function(doc) {

            if (doc.exists) {

                console.log("This Is Data:", doc.data());
                var AdUserId = doc.data().uid;
                localStorage.setItem("reciverId",AdUserId);
                makeRoom();

            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

                } 
        else {
        // No user is signed in.
        window.location.assign("logIn.html");
            }

    });
           var docRef = db.collection("Ads").doc(AdId);

        
}
      

function makeRoom(){
            
    var uId= firebase.auth().currentUser.uid;
    localStorage.setItem("userId",uId);
    var AdUserId=localStorage.getItem("reciverId");
    var userId=localStorage.getItem("userId");
    var AdId = localStorage.getItem('AdId',AdId);
      
      
    db.collection('Rooms')
    .where("ad_id","==",AdId)
    .where(`users.${userId}`,"==",true)
    .where(`users.${AdUserId}`,"==",true)
    .get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {

            console.log(querySnapshot.docs[0].data());
            console.log(querySnapshot.docs[0].id);
            var roomId= querySnapshot.docs[0].id
            var RoomId=localStorage.setItem("RoomId",roomId)

             window.location.href="chat.html"

      
        }  
        else {

         var userId=localStorage.getItem("userId");
         var DateNew = new Date();
         var currentTime = DateNew.toLocaleTimeString();
         var reciverId=localStorage.getItem("reciverId",reciverId);
        
        var messageRef = db.collection('Rooms').add
                ({
                    createdAt: currentTime,users:{[userId]:true,[AdUserId]:true
                    },
                    
                    ad_id: AdId
                
                }) .then(function(docRef) {

                    var DateNew = new Date();
                    var currentTime = DateNew.toLocaleTimeString();
                            
                    currentRoom = docRef.id;
                    console.log("current Room " + currentRoom)
                    var RoomId=localStorage.setItem("RoomId",currentRoom)
                  console.log("Your Work Has Been Done Succesfully");
                  window.location.href="chat.html"
              })
              .catch(function(error) {
                  console.error("Error adding document: ", error);
              }); 
            
        } 
    
        })
        .catch(function(error) {
        console.log("Error getting document: ", error);
        });


    }

         // var userId= firebase.auth().currentUser.uid;
var userId=localStorage.getItem("userId");
var reciverId=localStorage.getItem("reciverId");
var AdId=localStorage.getItem("AdId");


function send(){

                    var DateNew = new Date();
                    var currentTime = DateNew.toLocaleTimeString();

                    var RoomId1=localStorage.getItem("RoomId");

                    var messageText= document.getElementById("msg").value;

                   db.collection('Rooms').doc(RoomId1).collection('Message').add({


                    message:messageText,
                    senderId:userId,
                    reciverId:reciverId,
                    Time:currentTime,
                    Date:new Date(),
                    Send:firebase.auth().currentUser.uid

                   })

                messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
                return messaging.getToken()
            }).then(function(currentToken) {

                var tokenid = currentToken;

                var tok = localStorage.getItem('currentToken');


            //     db.collection('Tokens')
            //     .where("token","==",tok)
            //     .get().then(function(querySnapshot) {
            //     if (querySnapshot.size > 0) {
            //         console.log('Mil gya', currentToken);
            //        // alert("aaaaa");
            //     }
            //     else {
            //     db.collection("Tokens").add({
            //         token: tokenid,
            //         Current_Id: firebase.auth().currentUser.uid
            //     })
                
            //         //localStorage.setItem('currentToken', currentToken);
            //         console.log('currentToken', currentToken);
                    
            //     }
            // })
            // }).catch(function(err) {
            //     console.log('Unable to get permission to notify.', err);
            // });

            // messaging.onMessage((payload) => {
            //     console.log('payload', payload)
            // })


            var key = 'AIzaSyADrD1WzeWTWPYeppsYTimGOtUjgy8f4RE';
////Tokens
                    var Token;
                    db.collection('users').doc(localStorage.getItem('reciverId')).get().then(function(doc) {
                            Token = doc.data().token;   
                    })

                    db.collection('users').doc(localStorage.getItem('TUser')).get().then(function(doc) {

                    var to = Token;
                    var notification = {
                     'icon': 'images/ad.png',
                     'title': 'Message by: '+doc.data().name,
                     'body': messageText
                    };
                    //

                    fetch('https://fcm.googleapis.com/fcm/send', {
                     'method': 'POST',
                     'headers': {
                         'Authorization': 'key=' + key,
                         'Content-Type': 'application/json'
                     },
                     'body': JSON.stringify({
                         'notification': notification,
                         'to': to
                     })
                    }).then(function(response) {
                     console.log(response);
                    }).catch(function(error) {
                     console.error(error);
                    }); 
                   // var messageText= document.getElementById("msg").value="";
});
            


})
        }


function  gettingRooms(){
                  var messages=  document.getElementById("ChatMain")

                    db.collection("Rooms").where(`users.${userId}`,"==",true)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            let roomId=doc.id

                            var users1=Object.keys(doc.data().users)
                            
                            if(users1[0]==userId){
                                var reciverId=users1[1]
                                var docRef = db.collection("users").doc(reciverId);
                                docRef.get().then(function(doc) {
                                  
                                var userName=doc.data().name
                                messages.innerHTML+=`
                                        <a id="link" onclick="gotoRoom(this)" roomId="${roomId}" reciverId="${reciverId}" >
                                         <div class="chatRoom">
                                         <img src="images/user-icon.png" width="80px" height="80px;" id="Pic">
                                         <h1>${userName}</h1>
                                         <h1 id="rightArrow">></h1> 
                                         </div>
                                     </a>
                                         
                                         `;
                                  
                                })
                                
                            }
                            else{
                                var reciverId= users1[0]
                    
                               
                                var docRef = db.collection("users").doc(reciverId);
                                docRef.get().then(function(doc) {
                                  
                                        var userName=doc.data().name
                                        messages.innerHTML+=`
                                         
             
                                         <a onclick="gotoRoom(this)" roomId="${roomId}" reciverId="${reciverId}" >
                                         <div class="chatRoom">
                                         <img src="images/user-icon.png" width="80px" height="80px;" id="Pic">
                                         <h1>${userName}</h1>
                                         <h1 id="rightArrow">></h1> 
                                         </div>
                                     </a>
                                         
                                         `;
                                        
                                })
                               
                            }

                        });
                    })
                  
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });



                }

 function gotoRoom(a){

    var RoomId = a.getAttribute('roomId')
    var reciverId=a.getAttribute('reciverId')
    var roomId=localStorage.setItem("RoomId",RoomId);
    var reciverId=localStorage.setItem("reciverId",reciverId);
    window.location.href="chat.html";

                }





function initChat(adUserId, adId) {
    var tArea= document.getElementById('tArea').value;

    //Creating room info
    db.collection('rooms').add({
        createdAt: Date.now(),
        users: ['stct2U4ylRahlA3vi2LWiN6lNXl2', firebase.auth().currentUser.uid],
        ad_id: 'stct2U4ylRahlA3vi2LWiN6lNXl2',
    }).then(res => {
        console.log('res id***', res.id);
        currentRoomId = res.id;

        //Sending message!
       if(db.collection('rooms').doc(currentRoomId).collection('messages').add({message: tArea, sender: firebase.auth().currentUser.uid, receiver: 'stct2U4ylRahlA3vi2LWiN6lNXl2'})    ){
           getMsg();
       }
   
})

}

function get_message(argument) {
    
    var msg = document.getElementById('msg').value;
    
    var currentRoomId = localStorage.getItem('Ad_id');
    var msg_id = localStorage.getItem('msg_id');
    
    db.collection('rooms').doc(currentRoomId).collection('messages').orderBy('createdAt').get().then((res) => {
        res.forEach((doc) => {
    var p = document.createElement('p');    
            
        p.setAttribute('id', 'chat-txt');
        chat.appendChild(p);     
        p.innerHTML = doc.data().message;
        });
    });

}      

var id;        

function res() {
    // body...
}

function clickResponse(){

    Id = this.id;
    alert(this.id);
    id = document.getElementById(this.id).parentElement.childNodes[3].id;
    var userid = firebase.auth().currentUser.uid;
    if (id == firebase.auth().currentUser.uid) {
        var categories = document.getElementById(this.id).parentElement.childNodes[4].id;
        var city = document.getElementById(this.id).parentElement.childNodes[5].id;
        var pic = document.getElementById(this.id).parentElement.childNodes[6].id;
        var title = document.getElementById(this.id).parentElement.childNodes[0].childNodes[0].data;
        var name = document.getElementById(this.id).parentElement.childNodes[1].childNodes[0].data;
        var phone = document.getElementById(this.id).parentElement.childNodes[2].childNodes[0].data;
                    
        var modal_title = document.getElementById('modal-title');
        var modal_body = document.getElementById('modal-body');
        var modal_image = document.getElementById('modal-image');
        var modal_send = document.getElementById('modal-send');
        modal_send.style.display = 'none';

        modal_image.setAttribute('src', pic); 
                    
        modal_title.innerHTML = title;
        modal_body.innerHTML = "Category: " + categories + "<br><br>" + name + "<br><br>City: " + city + "<br><br>" + phone;
    }
    else{
        var categories = document.getElementById(this.id).parentElement.childNodes[4].id;
        var city = document.getElementById(this.id).parentElement.childNodes[5].id;
        var pic = document.getElementById(this.id).parentElement.childNodes[6].id;
        var title = document.getElementById(this.id).parentElement.childNodes[0].childNodes[0].data;
        var name = document.getElementById(this.id).parentElement.childNodes[1].childNodes[0].data;
        var phone = document.getElementById(this.id).parentElement.childNodes[2].childNodes[0].data;
                    
        var modal_title = document.getElementById('modal-title');
        var modal_body = document.getElementById('modal-body');
        var modal_image = document.getElementById('modal-image');
        var modal_send = document.getElementById('modal-send');
        modal_image.setAttribute('src', pic);
        modal_send.style.display = 'block';

            db.collection('rooms').add({
            
            createdAt: Date.now(),
            Users : [{id:true,userid:true}]
            }).then(res => {
                    
                console.log('res id***', res.id);
                localStorage.setItem('Ad_id', res.id);
                localStorage.setItem('User_id', id)
            });

        modal_title.innerHTML = title;
        modal_body.innerHTML = "Category: " + categories + "<br><br>" + name + "<br><br>City: " + city + "<br><br>" + phone;
    }    

    
}



function change() {
    // body...
   window.location = 'chat.html'
}
     
function message1() {

    var msg = document.getElementById('msg').value;
    var currentRoomId = localStorage.getItem('Ad_id');
    var id = firebase.auth().currentUser.uid;
    var User_id = localStorage.getItem('User_id');
    var chat = document.getElementById('chat');
    var p = document.createElement('p');    

        db.collection('rooms').doc(currentRoomId).collection('messages').add({message: msg, senderId:id, receiverId: User_id, createdAt: Date.now()}).then(res => {
            console.log('res id***', res.id);
            var msg_id = res.id;
            localStorage.setItem('msg_id', res.id)});
    
            p.setAttribute('id', 'chat-txt');
            chat.appendChild(p);
            p.innerHTML = msg;
            document.getElementById('msg').value = '';
            db.collection('chat').get()
            .then((res) => {
            res.forEach((doc) => {
            })


    });

}


function myAds() {
   var ads = document.getElementById('ads');
   var cen = document.getElementById('center');
   cen.style.display = 'block';
    var uid = firebase.auth().currentUser.uid;

    ads.innerHTML = "";
    db.collection('Ads').where('uid',"==",uid).get()
    .then((res) => {
        res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var r = doc.id;
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h3');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            
            img.setAttribute('src',doc.data().url);
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            button.setAttribute('type','button');
            button.setAttribute('value', 'Delete');
            button.setAttribute('class', 'dlt-btn');
            button.setAttribute('onclick', "deleteAdd('"+doc.id+"',this)");

            ads.appendChild(row);
            row.appendChild(div1);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(button);
            ads.appendChild(hr);

            h11.innerHTML = " Title: " + doc.data().title;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Category: '+doc.data().category;
            h14.innerHTML = 'City: '+doc.data().city;
            h15.innerHTML = 'Phone: '+doc.data().phone;

        })
     
        })
     
}

function deleteAdd(id,a){

        var result = confirm("Are you sure to delete this item?");
        if (result) {
            db.collection("Ads").doc(id).delete().then(function() {
                alert("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            
        }



         
        
    }


function check1(){
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location.assign("account.html");
  } else {
    // No user is signed in.
    window.location.assign("logIn.html");
  }
});
}





/* Add TO FAVORITES Start */

function addOffline(adId) {
  showLoader("Adding Offline");
  var adDetailsArr = [];
  if (localStorage.getItem("ads")) {
    adDetailsArr = JSON.parse(localStorage.getItem("ads"));
  }
  db.collection("ads")
    .doc(adId)
    .get()
    .then(data => {
      adDetailsArr.push(data.data());
      localStorage.setItem("ads", JSON.stringify(adDetailsArr));
      var req = new Request(data.data().url, { mode: "no-cors" });
      fetch(req).then(res => {
        caches.open("adsCache").then(cache => {
          console.log("Stored");

          return cache.put(req, res).then(() => {
            hideLoader();
            showMessage("Added Offline");
          });
        });
      });
    });
}

function addToFavorite(x,id) {

var FavId=firebase.auth().currentUser.uid;

        if (x.hasAttribute("fav")) {       
            x.removeAttribute("fav")
 
            console.log("Added To Favorite"+id)

            alert('Added To Favorite!' )
 
            db.collection("Ads").doc(id).get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data");


                    /* Adding Data To Favorite */
             db.collection("Favorite").add({
                AdTitle:doc.data().title,
                Name:doc.data().name,
                Category:doc.data().category,
                City:doc.data().city,
                Phone:doc.data().phone,
                Img_Url:doc.data().url,
                // img:doc.data().img,
                FavPersonID:FavId,
                // price:doc.data().price,
                AdId:id
             })
             .then(function(docRef) {
                 console.log("Document written with ID: ", docRef.id);

             })
             .catch(function(error) {
                 console.error("Error adding document: ", error);
            });

                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });         

            
        }
    
        else
        {
            x.setAttribute("fav", "no");

            db.collection('Favorite').where('AdId','==',id).get()
            .then(function(querySnapshot) {
                    
                var batch = db.batch();
                querySnapshot.forEach(function(doc) {
                batch.delete(doc.ref);
                        });

                return batch.commit();
                }).then(function() {
                    alert("Removed From Favorite!" )
                    }); 

        }

    }


function DisplayFavorite(){

    var fav = document.getElementById('favo');
    var favorite = document.getElementById('favorite');
    favorite.style.display = 'block';
    var uid = firebase.auth().currentUser.uid;

            fav.innerHTML = "";
    db.collection('Favorite').where('FavPersonID',"==",uid).get()
    .then((res) => {
        res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var r = doc.id;
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h3');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');

            img.setAttribute('src',doc.data().Img_Url);
            img.setAttribute('class','img-responsive');
            img.setAttribute('width','50');
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            button.setAttribute('type','button');
            button.setAttribute('value', 'Remove');
            button.setAttribute('class', 'dlt-btn');
            button.setAttribute('onclick', "removeFavorite('"+doc.id+"')");

            fav.appendChild(row);
            row.appendChild(div1);
            div1.appendChild(center);
            center.appendChild(img);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(button);
            fav.appendChild(hr);

            h11.innerHTML = " Title: " + doc.data().AdTitle;
            h13.innerHTML = 'Category: '+doc.data().Category;
            h14.innerHTML = 'City: '+doc.data().City;
            h15.innerHTML = 'Phone: '+doc.data().Phone;


        })
     

        })
}

/* Removing Favorite */

function  removeFavorite(id){

    console.log(id)
     var fav = document.getElementById('fav');
    db.collection("Favorite").doc(id).delete().then(function() {
     alert("Successfully deleted!");              
     fav.innerHT
  }).catch(function(error) {
     console.error("Error removing document: ", error);
 });

}

