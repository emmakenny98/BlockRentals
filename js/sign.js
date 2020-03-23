var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio;
var carouselArray = [];

firebase.auth().onAuthStateChanged(function(user) {
  
  //   User is signed in.
      
      user = firebase.auth().currentUser;
      if(user != null){
        uid = user.uid;
        email = user.email;
        App.handleContracts();
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
             
             
             //completeContract();
            
             
              

              
		});
        
        
		return App.bindEvents();
  	},

  	bindEvents: function() {
      
        $(document).on('click', '.verify', App.verifyTenancy);
      $(document).on('click', '.navbar-toggle-box-collapse', openSearch);
      $(document).on('click', '.close-box-collapse, .click-closed', closeSearch);
     
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

      pay: function(amount) {
        const cost = web3.toWei(amount, 'ether');
        web3.eth.getAccounts(function(error, result) {
          web3.eth.sendTransaction(
              {from: "0x694830D3Fdfaa00Bc911ea28845715666fb8Ee5f",
              to: "0xEfb720B565A1e37bC0E15713e19DE549D17E82FE",
              value:  cost
                  }, function(err, transactionHash) {
            if (!err)
              console.log(transactionHash); 
          });
      }).then(function(result){
      window.location.reload();
      });
        
      },
     
      signContract: function(index, deposit){
           var createListingInstance;
                var ret = []; 
        
        alert(index);
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                   console.log(error);
            }

     
    
            var account = accounts[0];
            App.contracts.CreateListing.deployed().then(function(instance) {
         

        
                 createListingInstance = instance;
                
                    
                     ret[index] = createListingInstance.signAgreement(index,  {from: account}).then(function(result) {

                window.location.reload();
        })
    })
})
                             
      },

      printContracts: function(indexes) {
                var createListingInstance;
                var ret = []; 
        
            App.contracts.CreateListing.deployed().then(function(instance) {
         

        
                 createListingInstance = instance;
                for(var i =0; i < indexes.length; i++){
                    
                     ret[i] = createListingInstance.getAgreement.call(indexes[i]).then(function(result) {
                                                
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
    
                           if(email == agreement.landEmail){
                            var example = document.createElement('div');
                            example.className = "col-md-12 col-lg-8";
                            example.innerHTML = ` 
                            <div class="row">
                            <div class="col-md-6 col-lg-4">
                            
                              <img id="pic-contract`+agreement.id+`" src="cont.png" alt="" class="img-fluid">
                            </div>
                            <div class="col-md-6 col-lg-4">
                            <div class="property-agent">
                            <h4 class="title-agent">`+agreement.addr+`</h4>
                            <p style="color:black">For tenant `+agreement.tenant+`</p>
                            <p style="color:black">`+agreement.today+`</p>
                            <a href="contract.html?q=`+agreement.id+`" class="color-text-a">View Contract</a>
                           
                            </div>
                            </div>
                            <div class="col-md-6 col-lg-4" id="verify`+agreement.id+`">
                            
                            </div>
                          
                            </div>
                            <br><br><br>
      `;
                              
                          document.getElementById("listings").appendChild(example);
                          
                          if(agreement.signed == false){
                           
                            document.getElementById("verify"+agreement.id+"").innerHTML = ` <p>`+agreement.tenant+` has not yet signed the rental agreemnt. <br>
                            <button type="button" style="background-color:#2eca6a; color:white; border:hidden" onclick=" window.location.href = 'mailto:`+agreement.tenantEmail+`?Subject=`+agreement.addr+` Rental Agreement Reminder&body=Dear `+agreement.tenant+`,%0A%0AI noticed that you have yet to sign the rental agreement for `+agreement.addr+`.%0APlease do so as soon as possible through the BlockRentals webapp. You can find the contract under the My Contracts tab.%0AShould you have any further questions, please do not hesitate to contact me at `+agreement.landEmail+`%0A%0AKind regards,%0A`+agreement.landlord+`'"  class="btn btn-a">Send Reminder Email to `+agreement.tenant+`</button>
                            `;
                          }
                          if(agreement.signed == true) {
                           
                            document.getElementById("verify"+agreement.id+"").innerHTML = ` <p class="color-text-a">
                            Contract Signed by: <br>`+agreement.tenant+`
                           </p>`;
                          }
                         
                           } 

                           if(email == agreement.tenantEmail){
                            var example = document.createElement('div');
                            example.className = "col-md-12 col-lg-8";
                            example.innerHTML = ` 
                            <div class="row">
                            <div class="col-md-6 col-lg-4">
                            
                              <img src="cont.png" alt="" class="img-fluid">
                            </div>
                            <div class="col-md-6 col-lg-4">
                            <div class="property-agent">
                            <h4 class="title-agent">`+agreement.addr+`</h4>
                            <p style="color:black">Created by: `+agreement.landlord+`</p>
                            <p style="color:black">`+agreement.today+`</p>
                            <a href="contract.html?q=`+agreement.id+`" class="color-text-a">View Contract</a>
                           
                            </div>
                            </div>
                            <div class="col-md-6 col-lg-4" id="verify`+agreement.id+`">
                            
                            </div>
                          
                            </div><br><br><br>
      `;
                              
                          document.getElementById("listings").appendChild(example);
                          
                          var etherumDeposit = agreement.deposit * 0.0082;
                          var rent = agreement.rent *0.0082;
                          if(agreement.signed == false){
                           
                            document.getElementById("verify"+agreement.id+"").innerHTML = ` 
                            <button type="button" style="background-color:#2eca6a; color:white; border:hidden" onclick="App.signContract(`+agreement.id+`,`+etherumDeposit+`)">Sign the Rental Agreement</button>
                            <br><br>
                            <button type="button" style="background-color:#2eca6a; color:white; border:hidden" onclick="App.pay(`+etherumDeposit+`)">Pay Deposit of `+etherumDeposit+`ETH(€`+agreement.deposit+`)</button>
                        `;
                          }
                          if(agreement.signed == true) {
                            
                            document.getElementById("verify"+agreement.id+"").innerHTML = ` <p class="color-text-a">
                            Contract Signed!
                           </p>
                           <br><br>
                           <button type="button" style="background-color:#2eca6a; color:white; border:hidden" onclick="App.pay(`+rent+`)">Pay Monthly Rent of `+rent+`ETH(€`+agreement.rent+`)</button>`;
                          }
                         
                           } 
    
                               });     
                 }
             })
         }, 
        

 
 handleContracts: function() {

    var createListingInstance;

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
               console.log(error);
        }

        var account = accounts[0];

        App.contracts.CreateListing.deployed().then(function(instance) {
               createListingInstance = instance;

            return createListingInstance.getAgreementIndexes.call(); 
        }).then(function(result) {
        App.printContracts(result);
       

    })	
}); 
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

function openSearch() {
    $('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
}

function closeSearch() {
    $('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
        $('.menu-list ul').slideUp(700);
}