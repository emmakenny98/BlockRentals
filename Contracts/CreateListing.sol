pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract CreateListing {

  
	struct Listing {
        uint id;                    // id of the listing
	    string name;                // name of the listing
        string addr;                // address of the listing
        string county;              // county of the listing
        uint price;                 // price of rent (per month)
        uint deposit;               // price for deposit
        string description;         // a description of the listing
        uint numBed;                // number of bedrooms
        uint numBath;               // number of bathrooms
        string landlordId;          // id of the landlord
        
	}

    struct Agreement {
        uint id;                    // id of the agreement
        string landlord;            // name of the landlord
        string landEmail;
        string tenant;              // name of the tenant
        string tenantEmail;
        string addr;               // title of the listing
                     // address of the listing
        string start;               // start date of tenancy
        string end;                 // end date of tenancy
        uint rent;                  // price of rent (per month)
        uint deposit;
        string todayDate;           // date the agreement was created
        bool signed;                // true if the agreement has been signed by the tenant
    }


	mapping(uint => Listing) public listings;	
    mapping(uint => Agreement) public agreements;
	
    uint[] public listingIndexes;
    uint[] public agreementIndexes;

    uint agreementCounter;
	uint listingCounter;
	
    function addListing(string memory name_form, string memory address_form, string memory county_form, uint price_form, uint deposit_form, string memory description_form, uint numBed_form, uint numBath_form, string memory landlordId_form) public {
        uint listingId = listingCounter++;
        listings[listingId].id = listingId;
        listings[listingId].name = name_form;
        listings[listingId].addr = address_form;
        listings[listingId].county = county_form;
        listings[listingId].price = price_form;
        listings[listingId].deposit = deposit_form;
        listings[listingId].description = description_form;
        listings[listingId].numBed = numBed_form;
        listings[listingId].numBath = numBath_form;
        listings[listingId].landlordId = landlordId_form;
       

       listingIndexes.push(listingId);
        
    }

    function addAgreement(string memory tenant_form, string memory tenantEmail_form, string memory landlord_form, string memory landEmail_form,  string memory address_form, string memory start_form, string memory end_form, uint rent_form, uint deposit_form,  string memory date_form) public {
        uint agreementId = agreementCounter++;

        agreements[agreementId].id = agreementId;
        agreements[agreementId].landlord = landlord_form;
        agreements[agreementId].landEmail = landEmail_form;
        agreements[agreementId].tenantEmail = tenantEmail_form;
        agreements[agreementId].tenant = tenant_form;
      
        agreements[agreementId].addr = address_form;
        agreements[agreementId].start = start_form;
        agreements[agreementId].end = end_form;
        agreements[agreementId].rent = rent_form;
         agreements[agreementId].deposit = deposit_form;
        agreements[agreementId].todayDate = date_form;

        agreementIndexes.push(agreementId);
    }

   function getAgreementIndexes() public returns (uint[] memory) {
       return agreementIndexes;
   }
	
    function getAgreement(uint index) public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory, string memory , uint, uint,  string memory, bool) {
        Agreement memory agree = agreements[index];

        return (agree.id, agree.tenant, agree.tenantEmail, agree.landlord, agree.landEmail,  agree.addr, agree.start, agree.end, agree.rent, agree.deposit,  agree.todayDate, agree.signed);
    }

	function getListingIndexes() public returns (uint[] memory) {
		return listingIndexes;
	}
	
	function getListing(uint index) public returns (string memory, string memory, string memory, uint, uint, string memory,uint, uint, uint, string memory) {
 		Listing memory house = listings[index];		
	
		return (house.name, house.addr, house.county, house.price, house.deposit, house.description, house.numBed, house.numBath, house.id, house.landlordId);
	}

    function signAgreement(uint index) public {
        agreements[index].signed = true;
    }
	
}	
