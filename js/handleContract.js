var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio;
var carouselArray = [];





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
             
             contractChange();
             
             
              

              
		});
        
        
		return App.bindEvents();
  	},

  	bindEvents: function() {
      
      $(document).on('click', '.verify', App.verifyTenancy);
      $(document).on('click', '.navbar-toggle-box-collapse', openSearch);
      $(document).on('click', '.close-box-collapse, .click-closed', closeSearch);
     
  	},
      verifyTenancy: function() {

     
        
  var tenantName = document.getElementById("tenantName-form").value;
  var tenantEmail = document.getElementById("tenantEmail-form").value;
  var landlordName = document.getElementById("landlordName-form").value;
  var landlordEmail = document.getElementById("landlordEmail-form").value;
  
  var address = document.getElementById("address-form").value;
  var start = document.getElementById("start-form").value;
  var end = document.getElementById("end-form").value;
  var price = document.getElementById("price-form").value;
  var deposit = document.getElementById("deposit-form").value;
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
                      return  createListingInstance.addAgreement(tenantName, tenantEmail, landlordName, landlordEmail, address, start, end, price, deposit, today,  {from: account});
              }).then(function(result) {
               
                window.location.replace("./myContracts.html");
          })
        });
      
      },
    
 
 
    completeContract: function() {
        var index = getUrlVars()["q"];
       

        var createListingInstance;
                var ret = []; 
            

  
            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
               
                     ret[index] = createListingInstance.getAgreement.call(index).then(function(result) {
                           
           var agreement= {
            id: result[0],
            tenant: result[1],
            tenantEmail: result[2],
            landlord: result[3],
            landEmail: result[4],
            addr: result[5],
            start: result[6],
            end: result[7],
            rent: result[8],
            deposit: result[9],
            today: result[10],
            signed: result[11]
                };


               document.getElementById("title-contract").innerHTML = "Rental agreement for "+agreement.addr+"";



               var textContract = `This Rental Agreement ('Agreement') is being made between [`+agreement.tenant+`] (“Renter”) and [`+agreement.landlord+`] ('Landlord').  [`+agreement.tenant+`] and [`+agreement.landlord+`] may also be referred to as 'Party' or together as the 'Parties'.<br><br><br>IN CONSIDERATION OF the Renter(s) agreeing to pay to lease the property owned by the Landlord, and the Landlord agreeing to lease their property to the Renter(s), the Parties agree to the following:
               <br><br><br> 
               1.  Premises and Occupancy
               <br><br><br>
               a.  Premises.  The property subject to this Agreement (“Premises”) is located at:
           <br><br>
           
           `+agreement.addr+`
           <br><br><br>
           b.  Occupancy. <br><br><br> The Renter(s) may begin occupying the Premises on `+agreement.start+` and must vacate the premises on `+agreement.end+`. 
           <br><br><br>
           2.  Costs and Payment
           <br><br><br>
           a.  Monthly Rent. <br><br><br> The Renter(s) agree to pay the Landlord rent in the amount of €`+agreement.rent+` to be paid on or before the first day of every month.
           <br>
           A deposit of €`+agreement.deposit+` must also be paid on signing of contract<br><br><br>
           
          
                 <button type="button" id="verify" class="btn btn-a verify">Verify on Blockchain</button>
           `
           
               document.getElementById("contract").innerHTML = textContract;
            })
        })

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
                                          county: result[2],
                                          price: result[3],
                                          deposit: result[4],
                                          description: result[5],
                                          numBeds: result[6],
                                          numBaths: result[7],
                                          index: result[8],
                                          landId: result[9],
                                          
                                    };
                   
                    let firebaseRefKey = firebase.database().ref().child(listing.landId);
                    firebaseRefKey.on('value', (dataSnapShot)=>{
                         landFirstName = dataSnapShot.val().userFullName;
                          landSurName = dataSnapShot.val().userSurname;
                           landFileName = dataSnapShot.val().image;
                         landEmail = dataSnapShot.val().userEmail;
                         landPhone = dataSnapShot.val().userPhone;
                         landBio = dataSnapShot.val().userBio;
                
                         var landlordName = landFirstName +" "+ landSurName;
                      var address = listing.name+", "+listing.address+", Co. "+listing.county;
              
                   document.getElementById("landlordName-form").value = landlordName;
                   document.getElementById("address-form").value = address
                   document.getElementById("price-form").value = listing.price;
                  
                   document.getElementById("landlordEmail-form").value = landEmail;
                   document.getElementById("deposit-form").value = listing.deposit
  
                  })
  
                  })
})
  
  
  
  
          
  
  },


  

};

$(function() {
	$(window).load(function() {
    
    App.init();
    
    
	});
});

  

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


function contractChange() { 
  var i = parseInt(getUrlVars()["q"]);
  
  App.handleContract(i);
}


function sendContract() {

  
  App.verifyTenancy();
  
  
}

/*function completeContract() {
  
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
}*/

function openSearch() {
    $('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
}

function closeSearch() {
    $('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
        $('.menu-list ul').slideUp(700);
}