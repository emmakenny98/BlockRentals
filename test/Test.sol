pragma solidity ^0.5.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "/Users/emmakenny/FYP-blockchain/blockchain-ek/Contracts/CreateListing.sol";

contract TestCreateListing {
 // The address of the adoption contract to be tested
 CreateListing createListing = CreateListing(DeployedAddresses.CreateListing());

 // The id of the pet that will be used for testing




function testListing() public {

  string memory  name = "Emma";

  string memory actual = createListing.addListing("Emma", "Galway", "house");
  Assert.equal(actual, name, "Adoption of the expected pet should match what is returned.");
}
}

