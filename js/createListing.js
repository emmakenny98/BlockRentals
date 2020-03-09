var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio, fileName;
var carouselArray = [];

firebase.auth().onAuthStateChanged(function(user) {
  
    //   User is signed in.
        
        user = firebase.auth().currentUser;
        if(user != null){
          uid = user.uid;
      }
  
      if(user ==null){
    
       window.location.href = "login.html";
      }
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
           
		});
        
        
		return App.bindEvents();
  	},

  	bindEvents: function() {
      $(document).on('click', '.btn-reg', App.handleCreateListing);
      $(document).on('click', '.navbar-toggle-box-collapse', openSearch);
      $(document).on('click', '.close-box-collapse, .click-closed', closeSearch);

     
    
  	},

   
  	//Executes solidity function to register an organization
  	handleCreateListing: function(event) {

   		event.preventDefault();
		
		var name = document.getElementById("name-form").value;
        var address = document.getElementById("address-form").value;
        var county = document.getElementById("county-form").value;
        var price = document.getElementById("price-form").value;
        
        var description = document.getElementById("description-form").value;
        var beds = document.getElementById("beds-form").value;
        var baths = document.getElementById("baths-form").value;
        var pics = [];
        var fileButton = document.getElementById("photo");
        for(var i = 0; i < fileButton.files.length; i++) {
            var file = fileButton.files[i];
            var storageRef = firebase.storage().ref(name + '/'+file.name);
            storageRef.put(file);
            pics[i] = file.name;
        }
         var firebaseRef = firebase.database().ref(name);
      
       
        for(var j = 0; j < pics.length; j++){
        
                var img = {
                    image: pics[j]
                    
                    
                }
                firebaseRef.child(j).set(img);
           
        }
       
    		var createListingInstance;
        
    		web3.eth.getAccounts(function(error, accounts) {
    			if (error) {
       				console.log(error);
    			}

         var fullName = firstName+" "+surName;
        
    			var account = accounts[0];
                user = firebase.auth().currentUser;
                alert(user.uid);
                var storageRef = firebase.storage().ref(user.uid + '/'+fileName);
                storageRef.getDownloadURL().then(function(url) {
                    console.log(url);
    			App.contracts.CreateListing.deployed().then(function(instance) {
       				createListingInstance = instance;
                  return  createListingInstance.addListing(name, address, county, price, description, beds, baths, user.uid,  {from: account});
    			}).then(function(result) {
            Swal.fire(
              'Your listing has been successfully sent to the blockchain!',
              'To learn more about blockchain technology, see the information page',
              'success'
            )
            
            })
            document.getElementById("addProperty-form").reset();
      })
    });
	


    },

  


  

};

$(function() {
	$(window).load(function() {
    
    App.init();
    
    
	});
});

function openSearch() {
    $('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
}

function closeSearch() {
    $('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
        $('.menu-list ul').slideUp(700);
}