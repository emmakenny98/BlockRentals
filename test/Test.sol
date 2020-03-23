pragma solidity ^0.5.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "/Users/emmakenny/FYP-blockchain/blockchain-ek/Contracts/CreateListing.sol";

contract TestCreateListing {

 CreateListing createListing = CreateListing(DeployedAddresses.CreateListing());

  
  function testListing() public {

    createListing.addListing("Clover Hill", "123 Road", "Galway", 300, 300, "A small house", 2, 2, "sampleId");

    (string memory name, string memory addr, string memory county, uint price, uint deposit, 
    string memory description, uint numBed, uint numBath,uint id, string memory landlord)  = createListing.getListing(0);
 

           
    Assert.equal(name, "Clover Hill", "Failed- Name isn't equal");
    Assert.equal(addr, "123 Road", "Failed- Address isn't equal");
    Assert.equal(county, "Galway", "Failed- County isn't equal");
    Assert.equal(price, 300, "Failed- Rent isn't equal");
    Assert.equal(deposit, 300, "Failed- Deposit isn't equal");
    Assert.equal(description, "A small house", "Failed- Description isn't equal");
    Assert.equal(numBed, 2, "Failed- Beds isn't equal");
    Assert.equal(numBath, 2, "Failed- Baths isn't equal");
    Assert.equal(id, 0, "Failed- ID isn't equal");
    Assert.equal(landlord, "sampleID", "Failed- landlord isn't equal");
  }

  function testAgreement() public {

    
 

    createListing.addAgreement("John Doe", "john@mail.com", "Emma Kenny", "emmakenny13@gmail.com", "123 Road", "01/01/20", "01/05/20", 300, 300, "22/03/20");

    (uint id, string memory tenant, string memory tenant_email, string memory landlord,
    string memory landlord_email, string memory addr, string memory start, string memory end, uint rent, uint deposit,
    string memory today, bool signed)  = createListing.getAgreement(0);
 

    Assert.equal(tenant, "John Doe", "Failed- tenant isn't equal");
    Assert.equal(tenant_email, "john@mail.com", "Failed- tenant email isn't equal");
    Assert.equal(landlord, "Emma Kenny", "Failed- landlord isn't equal");
    Assert.equal(landlord_email, "emmakenny13@gmail.com", "Failed- landlord email isn't equal");    
    Assert.equal(addr, "123 Road", "Failed- Address isn't equal");
    Assert.equal(id, 0, "Failed- ID isn't equal");
    Assert.equal(signed, false, "Failed- signed isn't equal");
    Assert.equal(rent, 300, "Failed- Rent isn't equal");
    Assert.equal(deposit, 300, "Failed- Deposit isn't equal");
    Assert.equal(start, "01/01/20", "Failed- start date isn't equal");
    Assert.equal(end, "01/05/20", "Failed- end date isn't equal");
    Assert.equal(today, "22/03/20", "Failed- todays date isn't equal");
  }
}

