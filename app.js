var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio;
var carouselArray = [];

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
          var fileName = dataSnapShot.val().image;
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
            })
   
          
});
});



App = {
	web3Provider: null,
  	contracts: {},
  	init: async function() {
		return await App.initWeb3();
  	},

  	initWeb3: async function() {
		if (window.ethereum) {
  			App.web3Provider = window.ethereum;
  			try {
    				await window.ethereum.enable();
  			} catch (error) {
    				console.error("User denied account access")
  			}
		}
	
		else if (window.web3) {
  			App.web3Provider = window.web3.currentProvider;
		}
	
		else {
  			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		}
	
		web3 = new Web3(App.web3Provider);

    		return App.initContract();
  	},

  	initContract: function() {
		$.getJSON('build/contracts/CreateListing.json', function(data) {
  			var CreateListingArtifact = data;
  			App.contracts.CreateListing = TruffleContract(CreateListingArtifact);
  			
              App.contracts.CreateListing.setProvider(App.web3Provider);
              
                App.printCarousel(1);
                App.printCarousel(2);
                App.printCarousel(3);

              
            
              App.printLatest();
              App.handleMyListings();
              App.handleHouse();
              
             
              propertySingleChange();
              contractChange();
              completeContract();
             
             
              

              
		});
        
        
		return App.bindEvents();
  	},

  	bindEvents: function() {
      $(document).on('click', '.btn-reg', App.handleCreateListing);
      $(document).on('click', '.verify', App.verifyTenancy);
     
  	},

    myListings: function(indexes) {
      
       var createListingInstance;
                var ret = []; 
                var pageNum = 0;
              
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                for(var i =0; i < indexes.length; i++){
                    pageNum++;
                     ret[i] = createListingInstance.getListing.call(indexes[i]).then(function(result) {
                            var listing= {
                           
                          name: result[0],
                              address: result[1],
                              price: result[2],
                              description: result[3],
                              numBeds: result[4],
                              numBaths: result[5],
                              index: result[6],
                              landName: result[7],
                              landEmail: result[8],
                              landPhone: result[9],
                              landBio: result[10]
                        };
                  let firebaseRefKey = firebase.database().ref().child(listing.name);
     
        firebaseRefKey.on('value', (dataSnapShot)=>{
            var name = dataSnapShot.val().image;
            
          
            
       
        var storageRef = firebase.storage().ref(listing.name + '/'+name);

        storageRef.getDownloadURL().then(function(url) {
         
       
                    if(email == listing.landEmail){
                        var example = document.createElement('div');
                        example.className = "col-md-4";
                        example.innerHTML = ` <div class="card-box-a card-shadow">
                          <div class="img-box-a">
                            <img src="`+url+`" alt="" class="img-a img-fluid" style="width:800px;height:400px;"/>
                          </div>
                          <div class="card-overlay">
                            <div class="card-overlay-a-content">
                              <div class="card-header-a">
                                <h2 class="card-title-a">
                                  <a href="#">`+listing.name+`
                                </h2>
                              </div>
                              <div class="card-body-a">
                                <div class="price-box d-flex">
                                  <span class="price-a">rent | € `+listing.price+`</span>
                                </div>
                                <a href="property-single.html" class="btn btn-default" id="`+listing.index+`">Click to view</a>
                                  <span class="ion-ios-arrow-forward"></span>
                                </a>
                              </div>
                              <div class="card-footer-a">
                                <ul class="card-info d-flex justify-content-around">
                                  
                                  <li>
                                    <h4 class="card-info-title">Beds</h4>
                                    <span>`+listing.numBeds+`</span>
                                  </li>
                                  <li>
                                    <h4 class="card-info-title">Baths</h4>
                                    <span>`+listing.numBaths+`</span>
                                  </li>
                                  <li>
                                    
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>`;
                          
                      document.getElementById("listings").appendChild(example);
                      let link = document.getElementById(listing.index);
                          link.href = link.href + "?q=" + listing.index + "";
                    }
                        });
                        })
    
                        })
                 }
             })

    },
    verifyTenancy: function(event) {

      event.preventDefault();
		
      var tenantName = getUrlVars()["tenantName"];
      var tenantEmail = getUrlVars()["tenantEmail"];
      var landName= getUrlVars()["landName"];
      var landEmail= getUrlVars()["landEmail"];
      var propName= getUrlVars()["propName"]; 
      var addr= getUrlVars()["address"];
      var start= getUrlVars()["start"];
      var end= getUrlVars()["end"];
      var price= getUrlVars()["price"];
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      
      today = dd + '/' + mm + '/' + yyyy;
      
  
          var createListingInstance;
          
          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                 console.log(error);
            }
  
            var account = accounts[0];
  
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                    return  createListingInstance.addAgreement(landName, tenantName, propName, addr, start, end, price, today, {from: account});
            }).then(function(result) {
             
              document.getElementById("addProperty-form").reset();
        })
      });
    
    },
  	//Executes solidity function to register an organization
  	handleCreateListing: function(event) {

   		event.preventDefault();
		
		var name = document.getElementById("name-form").value;
        var address = document.getElementById("address-form").value;
        var price = document.getElementById("price-form").value;
        
        var description = document.getElementById("description-form").value;
        var beds = document.getElementById("beds-form").value;
        var baths = document.getElementById("baths-form").value;
        
        var fileButton = document.getElementById("photo");
        var file = fileButton.files[0];
        var storageRef = firebase.storage().ref(name + '/'+file.name);
        storageRef.put(file);

         var firebaseRef = firebase.database().ref();
                var img = {
                    image: file.name
                    
                }
                firebaseRef.child(name).set(img);

    		var createListingInstance;
        
    		web3.eth.getAccounts(function(error, accounts) {
    			if (error) {
       				console.log(error);
    			}

         var fullName = firstName+" "+surName;
        
    			var account = accounts[0];

    			App.contracts.CreateListing.deployed().then(function(instance) {
       				createListingInstance = instance;
                  return  createListingInstance.addListing(name, address, price, description, beds, baths, fullName, email, phone, bio, {from: account});
    			}).then(function(result) {
            Swal.fire(
              'Your listing has been successfully sent to the blockchain!',
              'To learn more about blockchain technology, see the information page',
              'success'
            )
            
           
            document.getElementById("addProperty-form").reset();
      })
    });
	


    },

   printSingle: function(i) { 
            var createListingInstance;
             var ret = [];   
            
        
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                
                    ret[i] = createListingInstance.getListing.call(i).then(function(result) {
                            var listing= {
                           
                            name: result[0],
                            address: result[1],
                            price: result[2],
                            description: result[3],
                            numBeds: result[4],
                            numBaths: result[5],
                            index: result[6],
                            landName: result[7],
                            landEmail: result[8],
                            landPhone: result[9],
                            landBio: result[10]
                        };
                        
                     
        let firebaseRefKey = firebase.database().ref().child(listing.name);
      
        firebaseRefKey.on('value', (dataSnapShot)=>{
            var fileName = dataSnapShot.val().image;
           
       
        var storageRef = firebase.storage().ref(listing.name + '/'+fileName);

        storageRef.getDownloadURL().then(function(url) {
          
       
          var photos = document.createElement('div');
          photos.className = "carousel-item-b";
          photos.innerHTML = `<img src="`+url+`" alt="" style="width:800px;height:400px;">`
          document.getElementById("property-single-carousel").appendChild(photos);
                            var elem = document.createElement('div');
                            elem.className = "container";
                            elem.innerHTML=`<div class="row">
                            <div class="col-md-12 col-lg-8">
                              <div class="title-single-box">
                                <h1 class="title-single">`+listing.name+`</h1>
                                <span class="color-text-a">`+listing.address+`</span>
                              </div>
                            </div>
                            <div class="col-md-12 col-lg-4">
                              <nav aria-label="breadcrumb" class="breadcrumb-box d-flex justify-content-lg-end">
                                <ol class="breadcrumb">
                                  <li class="breadcrumb-item">
                                    <a href="index.html">Home</a>
                                  </li>
                                  <li class="breadcrumb-item">
                                    <a href="property-grid.html">Properties</a>
                                  </li>
                                  <li class="breadcrumb-item active" aria-current="page">
                                    `+listing.name+`
                                  </li>
                                </ol>
                              </nav>
                            </div>
                          </div>;`
                                                    
                           document.getElementById("intro-single").appendChild(elem);   
        
                          var page = document.createElement('div');
                          page.className = "row justify-content-between";
                          

                          var land_email = listing.landEmail;
                          page.innerHTML = `
                              <div class="col-md-5 col-lg-4">
                                <div class="property-price d-flex justify-content-center foo">
                                  <div class="card-header-c d-flex">
                                    <div class="card-box-ico">
                                      <span class="ion-money">$</span>
                                    </div>
                                    <div class="card-title-c align-self-center">
                                      <h5 class="title-c">`+listing.price+`</h5>
                                    </div>
                                  </div>
                                </div>
                                <div class="property-summary">
                                  <div class="row">
                                    <div class="col-sm-12">
                                      <div class="title-box-d section-t4">
                                        <h3 class="title-d">Quick Summary</h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="summary-list">
                                    <ul class="list">
                                      <li class="d-flex justify-content-between" >
                                        <strong>Property ID:</strong>
                                        <span id="listingId">`+listing.index+`</span>
                                      </li>
                                      <li class="d-flex justify-content-between">
                                        <strong>Location:</strong>
                                        <span>`+listing.address+`</span>
                                      </li>
                                      <li class="d-flex justify-content-between">
                                        <strong>Property Type:</strong>
                                        <span>House</span>
                                      </li>
                                      <li class="d-flex justify-content-between">
                                        <strong>Status:</strong>
                                        <span>Sale</span>
                                      </li>
                                      
                                      <li class="d-flex justify-content-between">
                                        <strong>Beds:</strong>
                                        <span>`+listing.numBeds+`</span>
                                      </li>
                                      <li class="d-flex justify-content-between">
                                        <strong>Baths:</strong>
                                        <span>`+listing.numBaths+`</span>
                                      </li>
                                      <li class="d-flex justify-content-between">
                                        <strong></strong>
                                        <span>
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-7 col-lg-7 section-md-t3">
                                <div class="row">
                                  <div class="col-sm-12">
                                    <div class="title-box-d">
                                      <h3 class="title-d">Property Description</h3>
                                    </div>
                                  </div>
                                </div>
                                <div class="property-description">
                                  `+listing.description+`
                                </div>
                                
                              </div>
                            </div>
                          </div>
                          
                            
                          </div>
                          <div class="col-md-12">
                          <div class="row section-t3">
                            <div class="col-sm-12">
                              <div class="title-box-d">
                                <h3 class="title-d">Contact Landlord</h3>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-6 col-lg-4">
                              <img src="img/agent-4.jpg" alt="" class="img-fluid">
                            </div>
                            <div class="col-md-6 col-lg-4">
                              <div class="property-agent">
                                <h4 class="title-agent">`+listing.landName+`</h4>
                                <p class="color-text-a">
                                 `+listing.landBio+`
                                </p>
                                <ul class="list-unstyled">
                                  <li class="d-flex justify-content-between">
                                    <strong>Phone:</strong>
                                    <span class="color-text-a">`+listing.landPhone+`</span>
                                  </li>
                                  <li class="d-flex justify-content-between">
                                    
                                  </li>
                                  <li class="d-flex justify-content-between">
                                    <strong>Email:</strong>
                                    <span class="color-text-a">`+listing.landEmail+`</span>
                                  </li>
                                  <li class="d-flex justify-content-between">
                                  <div class="col-md-6 col-lg-4">
                                  <button type="button" onclick=" window.location.href = 'mailto:`+listing.landEmail+`?Subject=`+listing.name+`'"  class="btn btn-a">Send Message</button>
                                  
                                </div>
                                  </li>
                              
                                </ul>
                                <div class="col-md-12 col-lg-4">
                            <div class="property-contact">
                            
                                <div class="row">
                                  <div class="col-md-12 mb-1">
                                  <button type="button" onclick ="window.location.href='createContract.html?q=`+listing.index+`'" class="btn btn-a" id="btn-contractRent">Create a Rental Contract</a>
                                  </div>
                                  </div>
                                  </div>
                           
                              </div>
                            </div>
                            
                        
                        `;
                       
                       
        
                    
                        document.getElementById('col-sm-12').appendChild(page);                      
        });
      })
                        })
                 
             })
         }, 

  	printHouse: function(indexes) {
                var createListingInstance;
                var ret = []; 
                var pageNum = 0;
              
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                for(var i =0; i < indexes.length; i++){
                    pageNum++;
                     ret[i] = createListingInstance.getListing.call(indexes[i]).then(function(result) {
                            var listing= {
                           
                          name: result[0],
                              address: result[1],
                              price: result[2],
                              description: result[3],
                              numBeds: result[4],
                              numBaths: result[5],
                              index: result[6],
                              landName: result[7],
                              landEmail: result[8],
                              landPhone: result[9],
                              landBio: result[10]
                        };
                  let firebaseRefKey = firebase.database().ref().child(listing.name);
     
        firebaseRefKey.on('value', (dataSnapShot)=>{
            var name = dataSnapShot.val().image;
            
          
            
       
        var storageRef = firebase.storage().ref(listing.name + '/'+name);

        storageRef.getDownloadURL().then(function(url) {
          
       
        
                        var example = document.createElement('div');
                        example.className = "col-md-4";
                        example.innerHTML = ` <div class="card-box-a card-shadow">
                          <div class="img-box-a">
                            <img src="`+url+`" alt="" class="img-a img-fluid" style="width:800px;height:400px;"/>
                          </div>
                          <div class="card-overlay">
                            <div class="card-overlay-a-content">
                              <div class="card-header-a">
                                <h2 class="card-title-a">
                                  <a href="#">`+listing.name+`
                                </h2>
                              </div>
                              <div class="card-body-a">
                                <div class="price-box d-flex">
                                  <span class="price-a">rent | € `+listing.price+`</span>
                                </div>
                                <a href="property-single.html" class="btn btn-default" style="color: white" id="`+listing.index+`">Click to view</a>
                                  <span class="ion-ios-arrow-forward"></span>
                                </a>
                              </div>
                              <div class="card-footer-a">
                                <ul class="card-info d-flex justify-content-around">
                                  
                                  <li>
                                    <h4 class="card-info-title">Beds</h4>
                                    <span>`+listing.numBeds+`</span>
                                  </li>
                                  <li>
                                    <h4 class="card-info-title">Baths</h4>
                                    <span>`+listing.numBaths+`</span>
                                  </li>
                                  <li>
                                    
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>`;
                          
                      document.getElementById("houses").appendChild(example);
                      let link = document.getElementById(listing.index);
                          link.href = link.href + "?q=" + listing.index + "";
                        });
                        })
    
                        })
                 }
             })
         }, 
        
printLatest: function() {
 
  var createListingInstance;
                var ret = []; 
                var j= 0;

                var arrayCar = [];
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                for(var i =0; i < 3; i++){
                    pageNum = i;
                   
                     ret[i] = createListingInstance.getListing.call(i).then(function(result) {

          var listing= {
                           
                            name: result[0],
                                address: result[1],
                                price: result[2],
                                description: result[3],
                                numBeds: result[4],
                                numBaths: result[5],
                                index: result[6],
                                landName: result[7],
                                landEmail: result[8],
                                landPhone: result[9],
                                landBio: result[10]
                          };
                  
                       
                         
                          var example = document.createElement('div');
                          example.className = "carousel-item-b";
  example.innerHTML = `
  <div class="card-box-a card-shadow">
    <div class="img-box-a">
      <img src="img/property-6.jpg" alt="" class="img-a img-fluid">
    </div>
    <div class="card-overlay">
      <div class="card-overlay-a-content">
        <div class="card-header-a">
          <h2 class="card-title-a">
            <a href="property-single.html?q=`+listing.index+`">`+listing.name+`</a>
          </h2>
        </div>
        <div class="card-body-a">
          <div class="price-box d-flex">
            <span class="price-a">rent | € `+listing.price+`</span>
          </div>
          <a href="#" class="link-a">Click here to view
            <span class="ion-ios-arrow-forward"></span>
          </a>
        </div>
        <div class="card-footer-a">
          <ul class="card-info d-flex justify-content-around">
            
            <li>
              <h4 class="card-info-title">Beds</h4>
              <span>`+listing.numBeds+`</span>
            </li>
            <li>
              <h4 class="card-info-title">Baths</h4>
              <span>`+listing.numBaths+`</span>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  </div>`;
          document.getElementById("property-carousel").appendChild(example);

                })
         }
     })
},
 

printCarousel: function(id) {
  var createListingInstance;
                var ret = []; 
         

       //alert(id);
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                
                   
             
                     ret[id] = createListingInstance.getListing.call(id).then(function(result) {

          var listing= {
                           
                            name: result[0],
                                address: result[1],
                                price: result[2],
                                description: result[3],
                                numBeds: result[4],
                                numBaths: result[5],
                                index: result[6],
                                landName: result[7],
                                landEmail: result[8],
                                landPhone: result[9],
                                landBio: result[10]
                          };
                  
                       
                         
                         

                          document.getElementById("title"+id).innerHTML = listing.name;
                          document.getElementById("address"+id).innerHTML = listing.address;
                          var rent = "RENT | €" + listing.price;
                          document.getElementById("rent"+id).innerHTML = rent;
               
          


        

                          })
                 
             })
         }, 
        

 
 handleHouse: function() {

    var createListingInstance;

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
               console.log(error);
        }

        var account = accounts[0];

        App.contracts.CreateListing.deployed().then(function(instance) {
               createListingInstance = instance;

            return createListingInstance.getListingIndexes.call(); 
        }).then(function(result) {
        App.printHouse(result);
       

    })	
}); 
},


 
handleMyListings: function() {
 
  var createListingInstance;

  web3.eth.getAccounts(function(error, accounts) {
      if (error) {
             console.log(error);
      }

      var account = accounts[0];

      App.contracts.CreateListing.deployed().then(function(instance) {
             createListingInstance = instance;

          return createListingInstance.getListingIndexes.call(); 
      }).then(function(result) {
      App.myListings(result);
     

  })	
}); 
},


handleContract: function(index) {


    var createListingInstance;
                  var ret = []; 
              
  
    
              App.contracts.CreateListing.deployed().then(function(instance) {
                   createListingInstance = instance;
                 
                       ret[index] = createListingInstance.getListing.call(index).then(function(result) {
                             
             var listing= {
                           
                              name: result[0],
                                  address: result[1],
                                  price: result[2],
                                  description: result[3],
                                  numBeds: result[4],
                                  numBaths: result[5],
                                  index: result[6],
                                  landName: result[7],
                                  landEmail: result[8],
                                  landPhone: result[9],
                                  landBio: result[10]
                            };
                    
            
                 document.getElementById("landlordName-form").value = listing.landName;
                 document.getElementById("address-form").value = listing.address;
                 document.getElementById("price-form").value = listing.price;
                 document.getElementById("propName-form").value = listing.name;
                 document.getElementById("landlordEmail-form").value = listing.landEmail;
  
  
  
                  })
})
  
  
  
  
          
  
  },


  

};

$(function() {
	$(window).load(function() {
    
    App.init();
    
    
	});
});

  // Function to download data to a file
  function saveDynamicDataToFile(htmlCode, htmlPageName) {

    var userInput = htmlCode;
    
    var blob = new Blob([userInput], { type: "text/html;charset=utf-8" });
    saveAs(blob, htmlPageName);
}



  
  //listen for submit event//(1)
  document
    .getElementById('registrationform')
    .addEventListener('submit', regFormSubmit);
  
  //Submit form(1.2)
  function regFormSubmit(e) {
    e.preventDefault();
    // Get Values from the DOM
    
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    
  
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  
    //Show Alert Message(5)
    document.querySelector('.alert').style.display = 'block';
  
    //Hide Alert Message After Seven Seconds(6)
    setTimeout(function() {
      document.querySelector('.alert').style.display = 'none';
    }, 7000);
  
    //Form Reset After Submission(7)
    document.getElementById('registrationform').reset();
  }
  


   //listen for submit event//(1)
   document
   .getElementById('loginform')
   .addEventListener('submit', loginFormSubmit);
 
 //Submit form(1.2)
 function loginFormSubmit(e) {
   e.preventDefault();
   // Get Values from the DOM
   
   let email = document.querySelector('#email').value;
   let password = document.querySelector('#password').value;
   
 
   firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
 
   //Show Alert Message(5)
   document.querySelector('.alert').style.display = 'block';
 
   //Hide Alert Message After Seven Seconds(6)
   setTimeout(function() {
     document.querySelector('.alert').style.display = 'none';
   }, 7000);
 
   //Form Reset After Submission(7)
   document.getElementById('loginform').reset();
 }
 
//function to save file
function uploadFile(){
      
  var storageRef = firebase.storage().ref();
        // Get the file from DOM
        var file = document.getElementById("photo").files[0];
        console.log(file);
        
        //dynamically set reference to the file name
        var thisRef = storageRef.child(file.name);
  
        //put request upload file to firebase storage
        thisRef.put(file).then(function(snapshot) {
           alert("File Uploaded")
           console.log('Uploaded a blob or file!');
        });
    
  }

  function getUrlVars() {
    
      var url = window.location.href,
          vars = {};
      url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
           key = decodeURIComponent(key);
           value = decodeURIComponent(value);
           vars[key] = value;
      });
      return vars;
  
}

function propertySingleChange() { 
  var i = parseInt(getUrlVars()["q"]);
  
  App.printSingle(i);
}

function contractChange() { 
  var i = parseInt(getUrlVars()["q"]);
  
  App.handleContract(i);
}


function sendContract() {

  
  var tenantName = document.getElementById("tenantName-form").value;
  var tenantEmail = document.getElementById("tenantEmail-form").value;
  var landlordName = document.getElementById("landlordName-form").value;
  var landlordEmail = document.getElementById("landlordEmail-form").value;
  var propName = document.getElementById("propName-form").value;
  var address = document.getElementById("address-form").value;
  var start = document.getElementById("start-form").value;
  var end = document.getElementById("end-form").value;
  var price = document.getElementById("price-form").value;

  window.location.href='contract.html?tenantName='+tenantName+'&tenantEmail='+tenantEmail+'&landName='+landlordName+'&landEmail='+landlordEmail+'&propName='+propName+'&address='+address+'&start='+start+'&end='+end+'&price='+price+'';
  
  
}

function completeContract() {
  
    var tenantName = getUrlVars()["tenantName"];
    var tenantEmail = getUrlVars()["tenantEmail"];
    var landName= getUrlVars()["landName"];
    var landEmail= getUrlVars()["landEmail"];
    var propName= getUrlVars()["propName"];
    var address= getUrlVars()["address"];
    var start= getUrlVars()["start"];
    var end= getUrlVars()["end"];
    var price= getUrlVars()["price"];


    document.getElementById("title-contract").innerHTML = "Rental agreement for "+propName+", "+address+"";



    var textContract = `This Rental Agreement ('Agreement') is being made between [`+tenantName+`] (“Renter”) and [`+landName+`] ('Landlord').  [`+tenantName+`] and [`+landName+`] may also be referred to as 'Party' or together as the 'Parties'.<br><br><br>IN CONSIDERATION OF the Renter(s) agreeing to pay to lease the property owned by the Landlord, and the Landlord agreeing to lease their property to the Renter(s), the Parties agree to the following:
    <br><br><br> 
    1.  Premises and Occupancy
    <br><br><br>
    a.  Premises.  The property subject to this Agreement (“Premises”) is located at:
<br><br>
`+propName+`

<br><br>
`+address+`
<br><br><br>
b.  Occupancy. <br><br><br> The Renter(s) may begin occupying the Premises on `+start+` and must vacate the premises on `+end+`. 
<br><br><br>
2.  Costs and Payment
<br><br><br>
a.  Monthly Rent. <br><br><br> The Renter(s) agree to pay the Landlord rent in the amount of €`+price+` to be paid on or before the first day of every month.
<br><br><br>

<button type="button" onclick=" window.location.href = 'mailto:`+tenantEmail+`?subject=Rental Agreement for `+propName+`&body=Please follow the following link in order to sign your rental agreement for `+propName+`%0D%0A`+window.location.href +`'"  class="btn btn-a">Email to Tenant</button>
      <button type="button" id="verify" class="btn btn-a verify">Verify on Blockchain</button>
`

    document.getElementById("contract").innerHTML = textContract;
}



function getCarousel() { 
  App.printCarousel();
}

function getImage() {
  var starsRef = storageRef.child('/' + name+ '/' + file.name);

    // Get the download URL
    starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
        $scope.imageUrl = url;
    });
}

function loadProfile() { 
  //   User is signed in.
 
  user = firebase.auth().currentUser;
  
    uid = user.uid;

alert(user);
let firebaseRefKey = firebase.database().ref().child(uid);
firebaseRefKey.on('value', (dataSnapShot)=>{
     firstName = dataSnapShot.val().userFullName;
      surName = dataSnapShot.val().userSurname;
      var fileName = dataSnapShot.val().image;
     email = dataSnapShot.val().userEmail;
     phone = dataSnapShot.val().userPhone;
     bio = dataSnapShot.val().userBio;
     var storageRef = firebase.storage().ref(user.uid + '/'+fileName);
        storageRef.getDownloadURL().then(function(url) {
            alert(url);
            document.getElementById("userPfAvatar").src = url;
            document.getElementById("profile-pic").src = url;
            var nameFull = dataSnapShot.val().userFullName + " " +dataSnapShot.val().userSurname;
            document.getElementById("user-name").innerHTML = nameFull;
        })
      })
}