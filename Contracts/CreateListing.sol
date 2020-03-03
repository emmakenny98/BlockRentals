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
        string pic;
        
	}

    struct Agreement {
        uint id;
        string landlord;
        string tenant;
        string title;
        string addr;
        string start;
        string end;
        uint rent;
        string todayDate;
    }


	mapping(uint => Listing) public listings;	
    mapping(uint => Agreement) public agreements;
	
    uint[] public listingIndexes;
    uint[] public agreementIndexes;
    uint agreementCounter;
	uint listingCounter;
	
    function addListing(string memory name_form, string memory address_form, uint price_form,  string memory description_form, uint numBed_form, uint numBath_form, string memory fullName, string  memory email, string memory phone, string memory bio, string memory pic_form) public {
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
       listings[listingId].pic = pic_form;

       listingIndexes.push(listingId);
        
    }

    function addAgreement(string memory tenant_form, string memory landlord_form, string memory title_form, string memory address_form, string memory start_form, string memory end_form, uint rent_form, string memory date_form) public {
        uint agreementId = agreementCounter++;

        agreements[agreementId].id = agreementId;
        agreements[agreementId].landlord = landlord_form;
        agreements[agreementId].tenant = tenant_form;
        agreements[agreementId].title  = title_form;
        agreements[agreementId].addr = address_form;
        agreements[agreementId].start = start_form;
        agreements[agreementId].end = end_form;
        agreements[agreementId].rent = rent_form;
        agreements[agreementId].todayDate = date_form;

        agreementIndexes.push(agreementId);
    }

   function getAgreementIndexes() public returns (uint[] memory) {
       return agreementIndexes;
   }
	
	function getListingIndexes() public returns (uint[] memory) {
		return listingIndexes;
	}
	
    function getAgreement(uint index) public returns (string memory, string memory, string memory, string memory, string memory, string memory, uint, string memory) {
        Agreement memory agree = agreements[index];

        return (agree.landlord, agree.tenant, agree.title, agree.addr, agree.start, agree.end, agree.rent, agree.todayDate);
    }

	function getListing(uint index) public returns (string memory, string memory, uint, string memory, uint, uint, uint, string memory, string memory, string memory, string memory, string memory) {
 		Listing memory house = listings[index];		
	
		return (house.name, house.addr,  house.price,house.description, house.numBed, house.numBath, house.id, house.landlordName, house.landlordEmail, house.landlordPhone, house.landlordBio, house.pic);
	}


	
}	
