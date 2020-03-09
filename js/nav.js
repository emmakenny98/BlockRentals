firebase.auth().onAuthStateChanged(function(user) {
  
    //   User is signed in.
        
        user = firebase.auth().currentUser;
        if(user != null){
          uid = user.uid;
      }
  
      if(user ==null){
    
        document.getElementById("user-name").innerHTML = "SignUp/Login";
        document.getElementById("dropdown-1").href = "signup.html";
        document.getElementById("dropdown-2").href = "login.html";
        document.getElementById("dropdown-1").innerHTML = "SignUp";
        document.getElementById("dropdown-2").innerHTML = "Login";
        document.getElementById("profile-pic").src = "user.png";
      }
     
      let firebaseRefKey = firebase.database().ref().child(uid);
      firebaseRefKey.on('value', (dataSnapShot)=>{
           firstName = dataSnapShot.val().userFullName;
            surName = dataSnapShot.val().userSurname;
             fileName = dataSnapShot.val().image;
           email = dataSnapShot.val().userEmail;
           phone = dataSnapShot.val().userPhone;
           bio = dataSnapShot.val().userBio;
           
           var storageRef = firebase.storage().ref(user.uid + '/'+fileName);
              storageRef.getDownloadURL().then(function(url) {
                  
                  //document.getElementById("userPfAvatar").src = url;
                  document.getElementById("profile-pic").src = url;
                  var nameFull = dataSnapShot.val().userFullName + " " +dataSnapShot.val().userSurname;
                  document.getElementById("user-name").innerHTML = nameFull;
                  document.getElementById("dropdown-1").href = "listings.html";
                  document.getElementById("dropdown-2").href = "profile.html";

                  document.getElementById("dropdown-1").innerHTML = "My Listings";
                  document.getElementById("dropdown-2").innerHTML = "My Profile";

                  document.getElementById("sign-in-dropdown").innerHTML += `<a class="dropdown-item" href="myContracts.html" id="dropdown-3"style="color:black">My Contracts</a>
                  <a class="dropdown-item" href="" onclick="signOut()" id="dropdown-3"style="color:black">Sign Out</a>`;
              })
     
            
  });
  });