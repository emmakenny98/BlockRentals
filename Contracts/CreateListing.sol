pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract CreateListing {

	struct Listing {
        uint id; 
	    string name;
        string addr;
        uint price;
        uint deposit;
        string description;
        uint numBed;
        uint numBath;
        //string photo;
	}


	mapping(uint => Listing) public listings;	
	
    uint[] public listingIndexes;
	uint listingCounter;
	
    function addListing(string memory name_form, string memory address_form, uint price_form, uint deposit_form, string memory description_form, uint numBed_form, uint numBath_form) public returns (string memory) {
        uint listingId = listingCounter++;
        listings[listingId].id = listingId;
        listings[listingId].name = name_form;
        listings[listingId].addr = address_form;
        listings[listingId].price = price_form;
        listings[listingId].deposit = deposit_form;
        listings[listingId].description = description_form;
        listings[listingId].numBed = numBed_form;
        listings[listingId].numBath = numBath_form;
        //listing[listingId].photo = photo_form;

        listingIndexes.push(listingId);

        return listings[listingId].name;
    }
	
	function getListingIndexes() public returns (uint[] memory) {
		return listingIndexes;
	}
	
	function getListing(uint index) public returns (string memory, string memory, uint, uint, string memory, uint, uint) {
 		Listing memory house = listings[index];		
		string memory name_ret = house.name;
		string memory address_ret = house.addr;
       
        uint price_ret = house.price;
        uint deposit_ret = house.deposit;
        string memory description_ret = house.description;
        uint numBed_ret = house.numBed;
        uint numBath_ret = house.numBath;
        //string memory photo_ret = house.photo;

		return (name_ret, address_ret,  price_ret, deposit_ret, description_ret, numBed_ret, numBath_ret);
	}


	
}	
