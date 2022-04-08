// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>@font-face {font-family: 'programme'; src: url('https://github.com/oscar-oneill/telepath/blob/main/public/fonts/programme.woff2');}</style><style>.base { fill: white; font-family: 'programme'; font-size: 18px; letter-spacing: -0.5px}</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Running", "Gliding", "Vibing", "Resting", "Drinking", "Crying", "Working", "Grinding", "Hustling", "Driving", "Selling", "Skipping", "Building", "Growing", "Breathing", "Eating", "Farting", "Supplying", "Dream", "Breathe", "Broke", "Happy", "Lost", "Win", "Start", "Underwhelmed", "Overwhelmed"];
    string[] secondWords = [" In ", " Across ", " Beyond ", " Within ", " Near "];
    string[] thirdWords = ["Bushwick", "East New York", "Coney Island", "Flatbush", "Flatlands", "Sunset Park", "Bay Ridge", "Gravesend", "Midwood", "Canarsie", "Brownsville", "Dumbo", "Red Hook", "Gowanus", "Fort Greene", "Bed-Stuy", "Sheepshead Bay", "Crown Heights", "Park Slope", "Jamaica", "Richmond Hill", "Ozone Park", "Far Rockaway", "Forest Hills", "Queensbridge", "Howard Beach", "Woodside", "Sunnyside", "Jackson Heights", "Laurelton", "Flushing", "St. Albans", "Astoria", "LIC", "Steinway", "Queens Village", "Corona", "Bayside", "Elmhurst", "Rego Park", "Woodhaven", "Kew Gardens", "The Upper West Side", "The Upper East Side", "SoHo", "NoHo", "Harlem", "Tribeca", "LES", "Gramercy", "Midtown", "West Village", "Turtle Bay", "Yorkville", "Spanish Harlem", "Chinatown", "Battery Park", "Lenox Hill", "South Bronx", "Melrose", "Highbridge", "Tremont", "East Tremont", "Morrisania", "Crotona Park", "Grand Concourse", "West Farms", "Hunts Point", "Fordham", "Kingsbridge", "Riverdale", "Norwood", "Williamsbridge", "Wakefield", "Woodlawn", "Castle Hill", "Soundview", "Port Morris", "Mott Haven", "Bedford Park", "Co-op City", "Morris Park", "Parkchester"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);
    
    constructor() ERC721 ("NFT Confidential", "Square Noir") {
        console.log("This is my NFT contract. Woah!");
    }

    function randomFirst(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function randomSecond(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function randomThird(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds.current();

        string memory first = randomFirst(newItemId);
        string memory second = randomSecond(newItemId);
        string memory third = randomThird(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A very underwhelming, and minimalistic collection of squares describing (your) daily life in New York.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        _tokenIds.increment();
        console.log("An NFT w/ID %s has been minted to %s", newItemId, msg.sender);

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}