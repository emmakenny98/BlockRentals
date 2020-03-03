var result = null;
var addresses = [];
var currentUser, uid, firstName, surName, email, phone, bio;
var carouselArray = [];
var pic = null;

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
                 
                        var example = document.createElement('div');
                        example.className = "col-md-4";
                        example.innerHTML = ` <div class="card-box-a card-shadow">
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
                                    
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>`;
                          
                      document.getElementById("houses").appendChild(example);
                      let link = document.getElementById(listing.index);
                          link.href = link.href + "?q=" + listing.index + ""; 
                          var photos = [];
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
       
      //console.log(urls);
       
      
      document.getElementById("pic-grid"+listing.index).src = urls[0];
        //alert(myPic);
      })
      });
      })
      
    
                               });     
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

 
  