// xxxxxxxxxx Working For Sign Up Form xxxxxxxxxx
// xxxxxxxxxx Full Name Validation xxxxxxxxxx
function checkUserFullName(){
    var userSurname = document.getElementById("userFullName").value;
    var flag = false;
    if(userSurname === ""){
        flag = true;
    }
    if(flag){
        document.getElementById("userFullNameError").style.display = "block";
       
    }else{
        document.getElementById("userFullNameError").style.display = "none";
    }
}
// xxxxxxxxxx User Surname Validation xxxxxxxxxx
function checkUserSurname(){
    var userSurname = document.getElementById("userSurname").value;
    var flag = false;
    if(userSurname === ""){
        flag = true;
    }
    if(flag){
        document.getElementById("userSurnameError").style.display = "block";
       
    }else{
        document.getElementById("userSurnameError").style.display = "none";
    }
}
// xxxxxxxxxx Email Validation xxxxxxxxxx
function checkUserEmail(){
    var userEmail = document.getElementById("userEmail");
    var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userEmail.value.match(userEmailFormate)){
        flag = false;
    }else{
        flag = true;
    }
    if(flag){
        document.getElementById("userEmailError").style.display = "block";
       
    }else{
        document.getElementById("userEmailError").style.display = "none";
    }
}



// xxxxxxxxxx Password Validation xxxxxxxxxx
function checkUserPassword(){
    var userPassword = document.getElementById("userPassword");
    var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      
    var flag;
    if(userPassword.value.match(userPasswordFormate)){
        flag = false;
    }else{
        flag = true;
    }    
    if(flag){
        document.getElementById("userPasswordError").style.display = "block";
     
    }else{
        document.getElementById("userPasswordError").style.display = "none";
    }
}
// xxxxxxxxxx Check user bio characters. It'll use later xxxxxxxxxx
function checkUserBio(){
    var userBio = document.getElementById("userBio").value;
    var flag = false;
    if(flag){
        document.getElementById("userBioError").style.display = "block";
    }else{
        document.getElementById("userBioError").style.display = "none";
    }
}
// xxxxxxxxxx Submitting and Creating new user in firebase authentication xxxxxxxxxx
function signUp(){
        var userFullName = document.getElementById("userFullName").value;
        var userSurname = document.getElementById("userSurname").value;
        var userEmail = document.getElementById("userEmail").value;
        var userPhone = document.getElementById("userPhone").value;
        var userPassword = document.getElementById("userPassword").value;
        var userBio = document.getElementById("userBio").value;
        var userFullNameFormate = /^([A-Za-z.\s_-])/;    
        var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      
    
        var checkUserFullNameValid = userFullName.match(userFullNameFormate);
        var checkUserEmailValid = userEmail.match(userEmailFormate);
        var checkUserPasswordValid = userPassword.match(userPasswordFormate);
    
        if(checkUserFullNameValid == null){
            return checkUserFullName();
        }else if(userSurname === ""){
            return checkUserSurname();
            
        }else if(checkUserEmailValid == null){
            return checkUserEmail();
        }else if(checkUserPasswordValid == null){
            return checkUserPassword();
        }else{
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
                var user = firebase.auth().currentUser;
                var uid;
                if (user != null) {
                    uid = user.uid;
                }
    
                var firebaseRef = firebase.database().ref();
                var userData = {
                    userFullName: userFullName,
                    userSurname: userSurname,
                    userEmail: userEmail,
                    userPhone: userPhone,
                    userBio: userBio, 
                  
                   
                }
                firebaseRef.child(uid).set(userData);
                Swal.fire(
        'Signed Up!',
        '',
        'success',
       
      ).then((value) => {
        setTimeout(function(){
            window.location.replace("./profile.html");
        }, 1000)
    })
}).catch(function(error){
       
        
        Swal.fire(
            'Error!',
            error.message,
            'error',
           
          )
    
               
            });
        }
    }
    
// xxxxxxxxxx Working For Sign In Form xxxxxxxxxx
// xxxxxxxxxx Sign In Email Validation xxxxxxxxxx
function checkUserSIEmail(){
    var userSIEmail = document.getElementById("userSIEmail");
    var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userSIEmail.value.match(userSIEmailFormate)){
        flag = false;
    }else{
        flag = true;
    }
    if(flag){
        document.getElementById("userSIEmailError").style.display = "block";
    }else{
        document.getElementById("userSIEmailError").style.display = "none";
    }
}
// xxxxxxxxxx Sign In Password Validation xxxxxxxxxx
function checkUserSIPassword(){
    var userSIPassword = document.getElementById("userSIPassword");
    var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      
    var flag;
    if(userSIPassword.value.match(userSIPasswordFormate)){
        flag = false;
    }else{
        flag = true;
    }    
    if(flag){
        document.getElementById("userSIPasswordError").style.display = "block";
    }else{
        document.getElementById("userSIPasswordError").style.display = "none";
    }
}
// xxxxxxxxxx Check email or password exsist in firebase authentication xxxxxxxxxx    
function signIn(){
    var userSIEmail = document.getElementById("userSIEmail").value;
    var userSIPassword = document.getElementById("userSIPassword").value;
    var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      

    var checkUserEmailValid = userSIEmail.match(userSIEmailFormate);
    var checkUserPasswordValid = userSIPassword.match(userSIPasswordFormate);

    if(checkUserEmailValid == null){
        return checkUserSIEmail();
    }else if(checkUserPasswordValid == null){
        return checkUserSIPassword();
    }else{
        firebase.auth().signInWithEmailAndPassword(userSIEmail, userSIPassword).then((success) => {
            Swal.fire(
                'Logged In!',
                '',
                'success',
               
              ).then((value) => {
                setTimeout(function(){
                    window.location.replace("./profile.html");
                }, 1000)
            });
        })
    }
}
// xxxxxxxxxx Working For Profile Page xxxxxxxxxx
// xxxxxxxxxx Get data from server and show in the page xxxxxxxxxx
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
        
      
    //   User is signed in.
        let user = firebase.auth().currentUser;
        let uid
        if(user != null){
            uid = user.uid;
        }
        let firebaseRefKey = firebase.database().ref().child(uid);

        
        firebaseRefKey.on('value', (dataSnapShot)=>{
            document.getElementById("userPfFullName").innerHTML = dataSnapShot.val().userFullName;
            document.getElementById("userPfSurname").innerHTML = dataSnapShot.val().userSurname;
            document.getElementById("userPfEmail").innerHTML= dataSnapShot.val().userEmail;
            // userPassword = dataSnapShot.val().userPassword;
            document.getElementById("userPfPhone").innerHTML = dataSnapShot.val().userPhone;
            document.getElementById("userPfBio").innerHTML = dataSnapShot.val().userBio;
            var fileName = dataSnapShot.val().image;
          
            if(fileName == null){
                document.getElementById("userPfAvatar").src = "user.png";
                document.getElementById("profile-pic").src = "user.png";
              
              
                document.getElementById("user-name").innerHTML = nameFull;
                document.getElementById("dropdown-1").href = "listings.html";
                document.getElementById("dropdown-2").hrf = "profile.html";
                document.getElementById("dropdown-1").innerHTML = "My Listings";
                document.getElementById("dropdown-2").innerHTML = "My Profile";
            }
            var storageRef = firebase.storage().ref(user.uid + '/'+fileName);
            storageRef.getDownloadURL().then(function(url) {
                
                document.getElementById("userPfAvatar").src = url;
                document.getElementById("profile-pic").src = url;
              
                var nameFull = dataSnapShot.val().userFullName + " " +dataSnapShot.val().userSurname;
                document.getElementById("user-name").innerHTML = nameFull;
                document.getElementById("dropdown-1").href = "listings.html";
                document.getElementById("dropdown-2").hrf = "profile.html";
                document.getElementById("dropdown-1").innerHTML = "My Listings";
                document.getElementById("dropdown-2").innerHTML = "My Profile";
            })
        })
    } else {
       // document.getElementById("user-name").innerHTML = "SignUp or Login";
      //  document.getElementById("dropdown-1").href = "signup.html";
       // document.getElementById("dropdown-2").hrf = "login.html";
       // document.getElementById("dropdown-1").innerHTML = "Signup";
      //  document.getElementById("dropdown-2").innerHTML = "Login";
    }
});
// xxxxxxxxxx Show edit profile form with detail xxxxxxxxxx
function showEditProfileForm(){
    document.getElementById("profileSection").style.display = "none"
    document.getElementById("editProfileForm").style.display = "block"
    var userPfFullName = document.getElementById("userPfFullName").innerHTML;
    var userPfSurname = document.getElementById("userPfSurname").innerHTML;
    var userPfEmail = document.getElementById("userPfEmail").innerHTML;
    var userPfBio = document.getElementById("userPfBio").innerHTML;
    var userPfPhone = document.getElementById("userPfPhone").innerHTML;
    document.getElementById("userFullName").value = userPfFullName; 
    document.getElementById("userSurname").value = userPfSurname; 
    document.getElementById("userEmail").value = userPfEmail;
    document.getElementById("userPhone").value = userPfPhone;
    
    document.getElementById("userBio").value = userPfBio; 
}
// xxxxxxxxxx Hide edit profile form xxxxxxxxxx
function hideEditProfileForm(){
    document.getElementById("profileSection").style.display = "block";
    document.getElementById("editProfileForm").style.display = "none";
}
// xxxxxxxxxx Save profile and update database xxxxxxxxxx
function saveProfile(){
    let userFullName = document.getElementById("userFullName").value 
    let userSurname = document.getElementById("userSurname").value 
    let userPhone = document.getElementById("userPhone").value;
    let userBio = document.getElementById("userBio").value;
    var userEmail = document.getElementById("userEmail").value;
    let user = firebase.auth().currentUser;
    var fileButton = document.getElementById("userAvatar");
    var file = fileButton.files[0];
    
    var storageRef = firebase.storage().ref(user.uid + '/'+file.name);
    storageRef.put(file);

     var firebaseRef = firebase.database().ref();
          
     

    var userFullNameFormate = /^([A-Za-z.\s_-])/; 
    var checkUserFullNameValid = userFullName.match(userFullNameFormate);
    if(checkUserFullNameValid == null){
        return checkUserFullName();
    }else if(userSurname === ""){
        return checkUserSurname();
    }else{
        let user = firebase.auth().currentUser;
        let uid;
        if(user != null){
            uid = user.uid;
        }
        var firebaseRef = firebase.database().ref();
        var userData = {
            userFullName: userFullName,
            userSurname: userSurname,
            userEmail: userEmail,
            userPhone: userPhone,
            userBio: userBio,
            image:file.name
        }
        firebaseRef.child(uid).set(userData);
       
            
                document.getElementById("profileSection").style.display = "block";

                document.getElementById("editProfileForm").style.display = "none";
        
        
    }
}
// xxxxxxxxxx Working For Sign Out xxxxxxxxxx
function signOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        Swal.fire(
            'Signed Out!',
            '',
            'success',
           
          ).then((value) => {
         
       
                window.location.replace("./index.html");
          })
           
    })
}