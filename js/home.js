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
              
               
             callCarousel();
              App.handleLatest();

              
		});
        
        
		return App.bindEvents();
  	},

      bindEvents: function(){
        $(document).on('click', '.navbar-toggle-box-collapse', openSearch);
        $(document).on('click', '.close-box-collapse, .click-closed', closeSearch);
      },
  

    
        printLatest: function(indexes) {

            var createListingInstance;
                var ret = []; 
         

            App.contracts.CreateListing.deployed().then(function(instance) {
                 createListingInstance = instance;
                
                   
        for(var id =0; id < indexes.length; id++){
                     ret[id] = createListingInstance.getListing.call(indexes[id]).then(function(result) {

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



          var example = document.createElement('div');
                        example.className = "col-md-4";
                        example.innerHTML = ` <div class="card-box-a card-shadow" onclick="window.location='property-single.html?q=`+listing.index+`'">
                          <div class="img-box-a" >
                          <img src="" alt="" id="pic-grid`+listing.index+`" class="img-a img-fluid" style="width:800px;height:400px;"/>
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
                                  <h4 class="card-info-title">County</h4>
                                  <span>`+listing.county+`</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>`;
                          
                      document.getElementById("latest").appendChild(example);
                      let link = document.getElementById(listing.index);
                          link.href = link.href + "?q=" + listing.index + ""; 
                          var photos = [];
                          var urls = [];
      
          
      
                      var urlRef = firebase.database().ref().child(listing.name);
           
           
      urlRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
         
          var name =child.val().image;
          
      
      
        var storageRef = firebase.storage().ref(listing.name + '/'+name);
      
        storageRef.getDownloadURL().then(function(url) {
            urls.push(url);
            pic = url;
       
    
       
      
      document.getElementById("pic-grid"+listing.index).src = urls[0];
        //alert(myPic);
      })
      });
      })
      
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
                                    county: result[2],
                                    price: result[3],
                                    description: result[4],
                                    numBeds: result[5],
                                    numBaths: result[6],
                                    index: result[7],
                                    landId: result[8],
                                    
                              };
                  var car = ` <li data-target="#myCarousel" id="item`+id+`" data-slide-to="`+id+`"></li>`;
                    document.getElementById("carousel-indicators").innerHTML += car;
               
                    var pic = `<div class="carousel-item intro-item bg-image carousel-item-a" id="pic`+id+`">
                    
                    <div class="overlay overlay-a"></div>
        <div class="intro-content display-table">
          <div class="table-cell">
            <div class="container">
              <div class="row">
                <div class="col-lg-8">
                  <div class="intro-body">
                    <p class="intro-title-top">`+listing.address+`</p>
                    <h1 class="intro-title mb-4">
                      <span class="color-b" style="font-size:80px; font-weight: bold; color:white">`+listing.name+`</h1>
                    <p class="intro-subtitle intro-price">
                      <a href="" id="link`+id+`"><span class="price-a" style="font-size:30px">rent | € `+listing.price+`</span></a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

       
                  document.getElementById("images").innerHTML += pic;
                  document.getElementById("item1").className = "active";
                  document.getElementById("pic1").className = "carousel-item active";
                  var urls = [];
      
          
      
                  var urlRef = firebase.database().ref().child(listing.name);
       
       
  urlRef.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
     
      var name =child.val().image;
      
  
  
    var storageRef = firebase.storage().ref(listing.name + '/'+name);
  
    storageRef.getDownloadURL().then(function(url) {
        urls.push(url);
        pic = url;
   
  
  
  document.getElementById("pic"+id).style.backgroundImage ="url("+urls[0]+")";
  document.getElementById("pic"+id).style.height = "800px";
    
  })
  });
  })
  


        

                          })
                 
             })
         }, 
        


        handleLatest: function() {

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
                
                App.printLatest(result.slice(result.length-3, result.length));
               
        
            })	
        }); 
        },
  

};

$(function() {
	$(window).load(function() {
    
    App.init();
    
    
	});
});

  

function callCarousel() {
   for(var i =1; i< 4; i++){
        App.printCarousel(i);
   }

   
}

function openSearch() {
    $('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
}

function closeSearch() {
    $('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
        $('.menu-list ul').slideUp(700);
}