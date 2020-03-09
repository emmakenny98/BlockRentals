var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio, profPic;
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
              
              
             
              propertySingleChange();
             
              

              
		});
        
        
		return App.bindEvents();
  	},

    bindEvents: function() {
      $(document).on('click', '.navbar-toggle-box-collapse', openSearch);
      $(document).on('click', '.close-box-collapse, .click-closed', closeSearch);
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
                                county: result[2],
                                price: result[3],
                                description: result[4],
                                numBeds: result[5],
                                numBaths: result[6],
                                index: result[7],
                                landId: result[8],
                                
                          };
          console.log(listing);
                        alert(listing.landId);
          let firebaseRefKey = firebase.database().ref().child(listing.landId);
          firebaseRefKey.on('value', (dataSnapShot)=>{
               firstName = dataSnapShot.val().userFullName;
                surName = dataSnapShot.val().userSurname;
                 fileName = dataSnapShot.val().image;
               email = dataSnapShot.val().userEmail;
               phone = dataSnapShot.val().userPhone;
               bio = dataSnapShot.val().userBio;
      
               var landlordName = firstName +" "+ surName;
               var storageRef = firebase.storage().ref(listing.landId + '/'+fileName);
               storageRef.getDownloadURL().then(function(url) {
                   
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
                              <img src="`+url+`" alt="" class="img-fluid">
                            </div>
                            <div class="col-md-6 col-lg-4">
                            <div class="property-agent">
                            <h4 class="title-agent">`+landlordName+`</h4>
                            <p class="color-text-a">
                             `+bio+`
                            </p>
                           
                            </div>
                            </div>
                            <div class="col-md-6 col-lg-4">
                              <div class="property-agent">
                              <ul class="list-unstyled">
                              <li class="d-flex justify-content-between">
                                <strong>Phone:</strong>
                                <span class="color-text-a">`+phone+`</span>
                              </li>
                              <li class="d-flex justify-content-between">
                                
                              </li>
                              <li class="d-flex justify-content-between">
                                <strong>Email:</strong>
                                <span class="color-text-a">`+email+`</span>
                              </li>
                              <br><br>
                              <p class="color-text-a">
                              If you are interested in renting this property, please contact `+landlordName+` by clicking the link below!<br><br>
                             </p>
                                
                                  <li class="d-flex justify-content-between">
                                  <div class="col-md-6 col-lg-4">
                                  <button type="button" style="background-color:#2eca6a; color:white; border:hidden" onclick=" window.location.href = 'mailto:`+listing.landEmail+`?Subject=`+listing.name+`'"  class="btn btn-a">Send Message</button>
                                  
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
                        
                             var i = 0;   
                  var pics = [];
        var urlRef = firebase.database().ref().child(listing.name);
        
                urlRef.once("value", function(snapshot) {
                  snapshot.forEach(function(child) {
                    console.log(child.key+": "+child.val().image);
                    var name = [child.val().image];
                  
                    var storageRef = firebase.storage().ref(listing.name + '/'+name);
        
                    storageRef.getDownloadURL().then(function(url) {
                      pics.push(url);
                      
                      var car = ` <li data-target="#myCarousel" id="item`+i+`" data-slide-to="`+i+`"></li>`;
                    document.getElementById("carousel-indicators").innerHTML += car;
                   
                    var pic = `<div class="carousel-item" id="pic`+i+`" style="height:500px; width:800px">
                    <img class="d-block w-100"  src="`+url+`" alt=""style="height:500px; width:800px">
                  </div>`;

                  document.getElementById("images").innerHTML += pic;
                  document.getElementById("item0").className = "active";
                  document.getElementById("pic0").className = "carousel-item active";

                  i++
                });
            });
          });
            
           
            
         
        
                        })
                 
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

function propertySingleChange() { 
  var i = parseInt(getUrlVars()["q"]);
  
  App.printSingle(i);
}

function openSearch() {
  $('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
}

function closeSearch() {
  $('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
      $('.menu-list ul').slideUp(700);
}