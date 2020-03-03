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
              

              
		});
        
        
		return;
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
                      <span class="color-b">`+listing.name+`</h1>
                    <p class="intro-subtitle intro-price">
                      <a href="" id="link`+id+`"><span class="price-a">rent | €`+listing.price+`</span></a>
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
      console.log(child.key+": "+child.val().image);
      var name =child.val().image;
      
  
  
    var storageRef = firebase.storage().ref(listing.name + '/'+name);
  
    storageRef.getDownloadURL().then(function(url) {
        urls.push(url);
        pic = url;
   
  console.log(urls);
   
  
  document.getElementById("pic"+id).style.backgroundImage ="url("+urls[0]+")";
  document.getElementById("pic"+id).style.height = "800px";
    //alert(myPic);
  })
  });
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

  

function callCarousel() {
   for(var i =1; i< 4; i++){
        App.printCarousel(i);
   }
 
}