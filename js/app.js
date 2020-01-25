
var result = null;
var addresses = [];

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
              App.handleHouse();
		});
        
        
		return App.bindEvents();
  	},

  	bindEvents: function() {
    	$(document).on('click', '.btn-reg', App.handleCreateListing);
	
  	},

  	//Executes solidity function to register an organization
  	handleCreateListing: function(event) {

   		event.preventDefault();
		
		var name = document.getElementById("name-form").value;
        var address = document.getElementById("address-form").value;
        var price = document.getElementById("price-form").value;
        var deposit = document.getElementById("deposit-form").value;
        var description = document.getElementById("description-form").value;
        var beds = document.getElementById("beds-form").value;
        var baths = document.getElementById("baths-form").value;
        




    		var createListingInstance;

    		web3.eth.getAccounts(function(error, accounts) {
    			if (error) {
       				console.log(error);
    			}

    			var account = accounts[0];

    			App.contracts.CreateListing.deployed().then(function(instance) {
       				createListingInstance = instance;
                   return createListingInstance.addListing(name, address, price, deposit, description, beds, baths, {from: account});
    			}).then(function(result) {
				document.getElementById("addProperty-form").reset();
			})
		});
  
  	},
  
  	printHouse: function(indexes) {
                var createListingInstance;
                var ret = []; 
            
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                for(var i =0; i < indexes.length; i++){
                     ret[i] = createListingInstance.getListing.call(indexes[i]).then(function(result) {
                            var listing= {
                            name: result[0],
                            address: result[1],
                            price: result[2],
                            deposit: result[3],
                            description: result[4],
                            numBeds: result[5],
                            numBaths: result[6],
                            //photo: result[7]
                        };
                
                       
                       

                        var example = document.createElement('div');
                        example.className = "col-md-4";
                        example.innerHTML = `<div class="card-box-a card-shadow">
                          <div class="img-box-a">
                            <img src="img/property-3.jpg" alt="" class="img-a img-fluid"/>
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
                                <a href="property-single.html" class="link-a">Click here to view
                                  <span class="ion-ios-arrow-forward"></span>
                                </a>
                              </div>
                              <div class="card-footer-a">
                                <ul class="card-info d-flex justify-content-around">
                                  <li>
                                    <h4 class="card-info-title">Deposit</h4>
                                    <span>
                                      € `+listing.deposit+`
                                    </span>
                                  </li>
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
                          </div>`;

                      
                      document.getElementById("houses").appendChild(example);
                       
                       
                    
                     
                        })
                 }
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

};

$(function() {
	$(window).load(function() {
        App.init();
    
	});
});

  
  //Reference for form collection(3)
  let formMessage = firebase.database().ref('register');
  
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
      
    // Created a Storage Reference with root dir
    var storageRef = firebase.storage().ref();
    // Get the file from DOM
    var file = document.getElementById("photo").files[0];
    console.log(file);
    
    //dynamically set reference to the file name
    var thisRef = storageRef.child(file.name);

    //put request upload file to firebase storage
    thisRef.put(file);
    
  }