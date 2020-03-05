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
    
    bindEvents: function() {
      $(document).on('change', '.custom-select', function(){  
      var select =  $(this).find(":selected").val();
    
      dropdown(select);
      })

      $(document).on('change', '.county-select', function(){  
        var select =  $(this).find(":selected").val();
      
        getCounty(select);
        })

  	},


    printNewest: function(indexes) {
          var createListingInstance;
          var ret = [];
          document.getElementById("houses").innerHTML = "";
          App.contracts.CreateListing.deployed().then(function(instance) {
            createListingInstance = instance;
            
            var temp = `<div class="col-sm-12">
            <div class="grid-option">
              <form>
                <select class="custom-select">
                  <option value="0">All</option>
                  <option selected>New to Old</option>
                  <option value="2">For Rent</option>
                  <option value="3">For Sale</option>
                </select>
              </form>
              </div>
              <div class="col-sm-12">
              <form>
              <select class="county-select">
              <option value="Antrim">Antrim</option>
              <option value="Armagh">Armagh</option>
              <option value="Carlow">Carlow</option>
              <option value="Cavan">Cavan</option>
              <option value="Clare">Clare</option>
              <option value="Cork">Cork</option>
             <option value="Derry">Derry</option>
              <option value="Donegal">Donegal</option>
              <option value="Down">Down</option>
              <option value="Dublin">Dublin</option>
              <option value="Fermanagh">Fermanagh</option>
              <option value="Galway">Galway</option>
              <option value="Kerry">Kerry</option>
              <option value="Kildare">Kildare</option>
              <option value="Kilkenny">Kilkenny</option>
              <option value="Laois">Laois</option>
              <option value="Leitrim">Leitrim</option>
              <option value="Limerick">Limerick</option>
              <option value="Longford">Longford</option>
              <option value="Louth">Louth</option>
              <option value="Mayo">Mayo</option>
              <option value="Meath">Meath</option>
              <option value="Monaghan"></option>>
              <option value="Offaly">Offaly</option>
              <option value="Roscommon">Roscommon</option>
              <option value="Sligo">Sligo</option>
              <option value="Tipperary">Tipperary</option>
              <option value="Tyrone">Tyrone</option>
              <option value="Waterford">Waterford</option>
              <option value="Westmeath">Westmeath</option
              <option value="Wexford">Wexford</option>
              <option value="Wicklow">Wicklow</option>
              </select>
            </form>
            </div>
          </div>`;

          document.getElementById("houses").innerHTML = temp;
              for(var i = indexes.length; i>=0; i--){
                
                
                ret[i] =  createListingInstance.getListing.call(indexes[i]).then(function(result) {
                    
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
                                            <h4 class="card-info-title">County</h4>
                                            <span>`+listing.county+`</span>
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
    printCounty: function(indexes, value) {
              var createListingInstance;
              var ret = []; 
              var pageNum = 0;
      document.getElementById("houses").innerHTML = "";
          App.contracts.CreateListing.deployed().then(function(instance) {
        var temp = `<div class="col-sm-12">
        <div class="grid-option">
          <form>
            <select class="custom-select">
              <option selected>All</option>
              <option value="1">New to Old</option>
              <option value="2">For Rent</option>
              <option value="3">For Sale</option>
            </select>
          </form>
          </div>
          <div class="col-sm-12">
          <form>
            <select class="county-select">
            <option value="Antrim">Antrim</option>
            <option value="Armagh">Armagh</option>
            <option value="Carlow">Carlow</option>
            <option value="Cavan">Cavan</option>
            <option value="Clare">Clare</option>
            <option value="Cork">Cork</option>
            <option value="Derry">Derry</option>
            <option value="Donegal">Donegal</option>
            <option value="Down">Down</option>
            <option value="Dublin">Dublin</option>
            <option value="Fermanagh">Fermanagh</option>
            <option value="Galway">Galway</option>
            <option value="Kerry">Kerry</option>
            <option value="Kildare">Kildare</option>
            <option value="Kilkenny">Kilkenny</option>
            <option value="Laois">Laois</option>
            <option value="Leitrim">Leitrim</option>
            <option value="Limerick">Limerick</option>
            <option value="Longford">Longford</option>
            <option value="Louth">Louth</option>
            <option value="Mayo">Mayo</option>
            <option value="Meath">Meath</option>
            <option value="Monaghan">Monaghan</option>
            <option value="Offaly">Offaly</option>
            <option value="Roscommon">Roscommon</option>
            <option value="Sligo">Sligo</option>
            <option value="Tipperary">Tipperary</option>
            <option value="Tyrone">Tyrone</option>
            <option value="Waterford">Waterford</option>
            <option value="Westmeath">Westmeath</option>
            <option value="Wexford">Wexford</option>
            <option value="Wicklow">Wicklow</option>
            </select>
          </form>
        </div>
      </div>`;

      document.getElementById("houses").innerHTML = temp;
               createListingInstance = instance;
              for(var i =0; i < indexes.length; i++){
                  pageNum++;
                   ret[i] = createListingInstance.getListing.call(indexes[i]).then(function(result) {
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
                      if(listing.county == value){
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
                                <h4 class="card-info-title">County</h4>
                                          <span>`+listing.county+`</span>
                                  
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
    
  }
                             });     
               }
           })
       }, 
      
  	printHouse: function(indexes) {
                var createListingInstance;
                var ret = []; 
                var pageNum = 0;
        document.getElementById("houses").innerHTML = "";
            App.contracts.CreateListing.deployed().then(function(instance) {
          var temp = `<div class="col-sm-12">
          <div class="grid-option">
            <form>
              <select class="custom-select">
                <option selected>All</option>
                <option value="1">New to Old</option>
                <option value="2">For Rent</option>
                <option value="3">For Sale</option>
              </select>
            </form>
            </div>
            <div class="col-sm-12">
            <form>
              <select class="county-select">
              <option value="Antrim">Antrim</option>
              <option value="Armagh">Armagh</option>
              <option value="Carlow">Carlow</option>
              <option value="Cavan">Cavan</option>
              <option value="Clare">Clare</option>
              <option value="Cork">Cork</option>
              <option value="Derry">Derry</option>
              <option value="Donegal">Donegal</option>
              <option value="Down">Down</option>
              <option value="Dublin">Dublin</option>
              <option value="Fermanagh">Fermanagh</option>
              <option value="Galway">Galway</option>
              <option value="Kerry">Kerry</option>
              <option value="Kildare">Kildare</option>
              <option value="Kilkenny">Kilkenny</option>
              <option value="Laois">Laois</option>
              <option value="Leitrim">Leitrim</option>
              <option value="Limerick">Limerick</option>
              <option value="Longford">Longford</option>
              <option value="Louth">Louth</option>
              <option value="Mayo">Mayo</option>
              <option value="Meath">Meath</option>
              <option value="Monaghan">Monaghan</option>
              <option value="Offaly">Offaly</option>
              <option value="Roscommon">Roscommon</option>
              <option value="Sligo">Sligo</option>
              <option value="Tipperary">Tipperary</option>
              <option value="Tyrone">Tyrone</option>
              <option value="Waterford">Waterford</option>
              <option value="Westmeath">Westmeath</option>
              <option value="Wexford">Wexford</option>
              <option value="Wicklow">Wicklow</option>
              </select>
            </form>
          </div>
        </div>`;

        document.getElementById("houses").innerHTML = temp;
                 createListingInstance = instance;
                for(var i =0; i < indexes.length; i++){
                    pageNum++;
                     ret[i] = createListingInstance.getListing.call(indexes[i]).then(function(result) {
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
                                  <h4 class="card-info-title">County</h4>
                                            <span>`+listing.county+`</span>
                                    
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


handleNewest: function() {

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
      App.printNewest(result);
    
     

  })	
}); 
},

handleCounty: function(value) {

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
      App.printCounty(result, value);
     

  })	
}); 
},

};

$(function() {
	$(window).load(function() {
    
    App.init();
    
    
	});
});

 function dropdown(value) {
   if(value == '0'){
     App.handleHouse();
   }

   if(value == '1'){
     App.handleNewest();
     
   }
 }

 function getCounty(value){

  App.handleCounty(value); 
 }
  