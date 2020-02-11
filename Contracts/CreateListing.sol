pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract CreateListing {

  
	struct Listing {
        uint id; 
	    string name;
        string addr;
        uint price;
        string description;
        uint numBed;
        uint numBath;
        string landlordName;
        string landlordEmail;
        string landlordPhone;
        string landlordBio;
        
	}


	mapping(uint => Listing) public listings;	
	
    uint[] public listingIndexes;
	uint listingCounter;
	
    function addListing(string memory name_form, string memory address_form, uint price_form,  string memory description_form, uint numBed_form, uint numBath_form, string memory fullName, string  memory email, string memory phone, string memory bio) public {
        uint listingId = listingCounter++;
        listings[listingId].id = listingId;
        listings[listingId].name = name_form;
        listings[listingId].addr = address_form;
        listings[listingId].price = price_form;

        listings[listingId].description = description_form;
        listings[listingId].numBed = numBed_form;
        listings[listingId].numBath = numBath_form;
        listings[listingId].landlordName = fullName;
        listings[listingId].landlordEmail = email;
       listings[listingId].landlordPhone = phone;
       listings[listingId].landlordBio = bio;

       listingIndexes.push(listingId);
        
    }

   
	
	function getListingIndexes() public returns (uint[] memory) {
		return listingIndexes;
	}
	

    
	function getListing(uint index) public returns (string memory, string memory, uint, string memory, uint, uint, uint, string memory, string memory, string memory, string memory) {
 		Listing memory house = listings[index];		
	
		return (house.name, house.addr,  house.price,house.description, house.numBed, house.numBath, house.id, house.landlordName, house.landlordEmail, house.landlordPhone, house.landlordBio);
	}


	
}	
