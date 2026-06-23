const ADDR = {
  userManager: "0x1CB3CE8176239c63c092B2338923C0966D29bC33",
  createProperty: "0x045d2Fb6EA23C9fCfb3c11F7504f2A441D2f152f",
  tokeniseProperty: "0x56614c4AFd41dE226Dd748A5234C4Dc582034b50",
  fractionalPurchase: "0x1A80fe514957a70d7c616C38294365b27554B9EC",
  recordModule: "0xc29d6E7d4c212b4Ae8D372df3926786eB5fe0a41",
  deployProperty: "0x25E3C32895312e6519675Ac0296a7cE292CA4bcB",
  HistoryRecorder: "0x4eb1864c87E5797C0dB77BAAcF52F5AB896992ff",
  tradeModule: "0xefd75F875ACAe2f191458edF3cFDDF4a6C48d98B", // placeholder
};

const ABI = {
  UserManager: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "lockoutEndTime",
          type: "uint256",
        },
      ],
      name: "AccountLocked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "AccountUnlocked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "admin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "email",
          type: "string",
        },
      ],
      name: "AdminAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "attempts",
          type: "uint256",
        },
      ],
      name: "LoginAttemptFailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "status",
          type: "bool",
        },
      ],
      name: "UserBlacklisted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "UserLoggedIn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "email",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "role",
          type: "string",
        },
      ],
      name: "UserRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "UserUpdated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
        {
          internalType: "string",
          name: "_email",
          type: "string",
        },
        {
          internalType: "string",
          name: "_password",
          type: "string",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_phone",
          type: "string",
        },
      ],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_oldPassword",
          type: "string",
        },
        {
          internalType: "string",
          name: "_newPassword",
          type: "string",
        },
      ],
      name: "changePassword",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
      ],
      name: "getAddressByName",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "getFailedLoginInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "failedAttempts",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lastFailedTime",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isLocked",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "lockoutTimeRemaining",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLockoutDuration",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "getLockoutTimeRemaining",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMaxFailedAttempts",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "getMyProfile",
      outputs: [
        {
          internalType: "string",
          name: "email",
          type: "string",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "phone",
          type: "string",
        },
        {
          internalType: "string",
          name: "role",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "getNameByAddress",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "getUserInfo",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "email",
              type: "string",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "phone",
              type: "string",
            },
            {
              internalType: "string",
              name: "role",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isRegistered",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "isBlacklisted",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "failedLoginAttempts",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isLocked",
              type: "bool",
            },
          ],
          internalType: "struct UserManager.UserInfo",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "getUserRole",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "isAccountLocked",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "isAdmin",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "isBlacklisted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "isRegistered",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "isUser",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_email",
          type: "string",
        },
        {
          internalType: "string",
          name: "_password",
          type: "string",
        },
      ],
      name: "login",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_email",
          type: "string",
        },
        {
          internalType: "string",
          name: "_password",
          type: "string",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_phone",
          type: "string",
        },
      ],
      name: "registerUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_status",
          type: "bool",
        },
      ],
      name: "setBlacklistStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "superAdmin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_userAddr",
          type: "address",
        },
      ],
      name: "unlockAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_phone",
          type: "string",
        },
      ],
      name: "updateUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  CreateProperty: [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_userManager",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "durationSeconds",
						"type": "uint256"
					}
				],
				"name": "ChangeLogged",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "numTokens",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					}
				],
				"name": "PropertyCreated",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "numTokens",
						"type": "uint256"
					}
				],
				"name": "createProperty",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getLastPropertyId",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "getProperty",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "location",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "numTokens",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "exists",
								"type": "bool"
							}
						],
						"internalType": "struct CreateProperty.Property",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
  TokeniseProperty: [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_userManager",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_createProperty",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "durationSeconds",
						"type": "uint256"
					}
				],
				"name": "ChangeLogged",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "totalSupply",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					}
				],
				"name": "PropertyTokenized",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "createProperty",
				"outputs": [
					{
						"internalType": "contract CreateProperty",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "getTokenizedAsset",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "propertyId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "totalSupply",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "tokenized",
								"type": "bool"
							}
						],
						"internalType": "struct TokeniseProperty.TokenizedAsset",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSupply",
						"type": "uint256"
					}
				],
				"name": "tokenize",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "tokenizedAssets",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSupply",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "tokenized",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
  FractionalPurchase: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_userManager",
          type: "address",
        },
        {
          internalType: "address",
          name: "_tokeniseProperty",
          type: "address",
        },
        {
          internalType: "address",
          name: "_createProperty",
          type: "address",
        },
        {
          internalType: "address",
          name: "_history",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "pricePaid",
          type: "uint256",
        },
      ],
      name: "TokensPurchased",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "buyTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "buyingDates",
      outputs: [
        {
          internalType: "uint40",
          name: "",
          type: "uint40",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getBuyingDates",
      outputs: [
        {
          internalType: "uint40[]",
          name: "",
          type: "uint40[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getPropertySalesSummary",
      outputs: [
        {
          internalType: "string",
          name: "propertyName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "totalSold",
          type: "uint256",
        },
        {
          internalType: "string[]",
          name: "buyerNames",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "tokensOwned",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "buyersAddress",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getRemainingTokens",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getTokenPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getTotalSales",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "username",
          type: "string",
        },
      ],
      name: "getUserPropertiesByUsername",
      outputs: [
        {
          internalType: "string[]",
          name: "propertyNames",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "tokensOwned",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  RecordModule: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_history",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum RecordModule.Mode",
          name: "mode",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "batchPaid",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "processed",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sumBalancesBatch",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "poolRemainingAfter",
          type: "uint256",
        },
      ],
      name: "DividendBatchExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "userBalance",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "DividendPaid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum RecordModule.Mode",
          name: "mode",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "poolWei",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "perTokenWei",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint40",
          name: "fromDate",
          type: "uint40",
        },
        {
          indexed: false,
          internalType: "uint40",
          name: "toDate",
          type: "uint40",
        },
      ],
      name: "PlanCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "purchase",
          type: "address",
        },
      ],
      name: "PurchaseSet",
      type: "event",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "poolWei",
          type: "uint256",
        },
        {
          internalType: "uint40",
          name: "fromDate",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "toDate",
          type: "uint40",
        },
      ],
      name: "createPlanFixedPool",
      outputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "perTokenWei",
          type: "uint256",
        },
        {
          internalType: "uint40",
          name: "fromDate",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "toDate",
          type: "uint40",
        },
      ],
      name: "createPlanPerToken",
      outputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxCount",
          type: "uint256",
        },
      ],
      name: "executePlan",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "lastPlanId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "paid",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "plans",
      outputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "enum RecordModule.Mode",
          name: "mode",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "poolWei",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "perTokenWei",
          type: "uint256",
        },
        {
          internalType: "uint40",
          name: "fromDate",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "toDate",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "createdAt",
          type: "uint40",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "poolRemaining",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      name: "previewPlan",
      outputs: [
        {
          internalType: "address[]",
          name: "recipients",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "balances",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "sumBalances",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalPayout",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "purchase",
      outputs: [
        {
          internalType: "contract IPurchase",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "setPurchase",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  HistoryRecorder: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "writer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "enabled",
          type: "bool",
        },
      ],
      name: "AuthorizedWriterSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "enum HistoryRecorder.TxType",
          name: "txType",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "valueWei",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "counterparty",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "refId",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "string",
          name: "meta",
          type: "string",
        },
      ],
      name: "TxLogged",
      type: "event",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getCountOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "limit",
          type: "uint256",
        },
      ],
      name: "getHistoryOf",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "txType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "propertyId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valueWei",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "counterparty",
              type: "address",
            },
            {
              internalType: "address",
              name: "actor",
              type: "address",
            },
            {
              internalType: "uint40",
              name: "timestamp",
              type: "uint40",
            },
            {
              internalType: "uint64",
              name: "refId",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "meta",
              type: "string",
            },
          ],
          internalType: "struct HistoryRecorder.Tx[]",
          name: "out",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMyCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "limit",
          type: "uint256",
        },
      ],
      name: "getMyHistory",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "txType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "propertyId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valueWei",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "counterparty",
              type: "address",
            },
            {
              internalType: "address",
              name: "actor",
              type: "address",
            },
            {
              internalType: "uint40",
              name: "timestamp",
              type: "uint40",
            },
            {
              internalType: "uint64",
              name: "refId",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "meta",
              type: "string",
            },
          ],
          internalType: "struct HistoryRecorder.Tx[]",
          name: "out",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "limit",
          type: "uint256",
        },
      ],
      name: "getMyHistoryForProperty",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "txType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "propertyId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valueWei",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "counterparty",
              type: "address",
            },
            {
              internalType: "address",
              name: "actor",
              type: "address",
            },
            {
              internalType: "uint40",
              name: "timestamp",
              type: "uint40",
            },
            {
              internalType: "uint64",
              name: "refId",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "meta",
              type: "string",
            },
          ],
          internalType: "struct HistoryRecorder.Tx[]",
          name: "out",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getPropertyCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "offset",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "limit",
          type: "uint256",
        },
      ],
      name: "getPropertyHistory",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "txType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "propertyId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valueWei",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "counterparty",
              type: "address",
            },
            {
              internalType: "address",
              name: "actor",
              type: "address",
            },
            {
              internalType: "uint40",
              name: "timestamp",
              type: "uint40",
            },
            {
              internalType: "uint64",
              name: "refId",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "meta",
              type: "string",
            },
          ],
          internalType: "struct HistoryRecorder.Tx[]",
          name: "out",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
      ],
      name: "getPropertySummary",
      outputs: [
        {
          internalType: "uint256",
          name: "totalBuys",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalBuyTokens",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalTransfers",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalDividends",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sumDividendsWei",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "isAuthorized",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "propertySummary",
      outputs: [
        {
          internalType: "uint256",
          name: "totalBuys",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalBuyTokens",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalTransfers",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalDividends",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sumDividendsWei",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "note",
          type: "string",
        },
      ],
      name: "recordAdminAction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountTokens",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "valueWei",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "note",
          type: "string",
        },
      ],
      name: "recordBuy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountWei",
          type: "uint256",
        },
        {
          internalType: "uint64",
          name: "refId",
          type: "uint64",
        },
        {
          internalType: "string",
          name: "note",
          type: "string",
        },
      ],
      name: "recordDividend",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "propertyId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountTokens",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "note",
          type: "string",
        },
      ],
      name: "recordTransfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "writer",
          type: "address",
        },
        {
          internalType: "bool",
          name: "enabled",
          type: "bool",
        },
      ],
      name: "setAuthorizedWriter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  deployProperty: [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_userManager",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_createProperty",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_tokeniseProperty",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "ERC721IncorrectOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ERC721InsufficientApproval",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "approver",
						"type": "address"
					}
				],
				"name": "ERC721InvalidApprover",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "ERC721InvalidOperator",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "ERC721InvalidOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					}
				],
				"name": "ERC721InvalidReceiver",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					}
				],
				"name": "ERC721InvalidSender",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ERC721NonexistentToken",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "approved",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Approval",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "ApprovalForAll",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "durationSeconds",
						"type": "uint256"
					}
				],
				"name": "ChangeLogged",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					}
				],
				"name": "MetadataLocked",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					}
				],
				"name": "PropertyDeployed",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "admin",
						"type": "address"
					}
				],
				"name": "PropertyImmutable",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Transfer",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "approve",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "createProperty",
				"outputs": [
					{
						"internalType": "contract CreateProperty",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "deployments",
				"outputs": [
					{
						"internalType": "bool",
						"name": "deployed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "metadataLocked",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "immutableMarked",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getApproved",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "isApprovedForAll",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "lockMetadata",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "markAsImmutable",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "mintProperty",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "name",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ownerOf",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "setApprovalForAll",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes4",
						"name": "interfaceId",
						"type": "bytes4"
					}
				],
				"name": "supportsInterface",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "symbol",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "tokenURI",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "tokeniseProperty",
				"outputs": [
					{
						"internalType": "contract TokeniseProperty",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "transferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "verifyNotDeployed",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "verifyPropertyExists",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					}
				],
				"name": "verifyPropertyTokenized",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
  tradeModule: [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_userManager",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_tokeniseProperty",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_createProperty",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_fractionalPurchaseContract",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_quantity",
						"type": "uint256"
					}
				],
				"name": "buyOnSaleToken",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_id",
						"type": "uint256"
					}
				],
				"name": "getOnSaleToken",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "saleID",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "propertyId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "quantity",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "pricePerToken",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							}
						],
						"internalType": "struct Trade.onSaleToken",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "onSaleTokens",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "saleID",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerToken",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_propertyId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_pricePerToken",
						"type": "uint256"
					}
				],
				"name": "sellOwnedToken",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
};

const CONTRACT_ABI = ABI.UserManager;
const CONTRACT_ADDRESS = ADDR.userManager;

window.CONTRACT_ABI = CONTRACT_ABI;
window.CONTRACT_ADDRESS = CONTRACT_ADDRESS;

async function getContracts(web3) {
  // Basic sanity checks
  if (!web3) throw new Error("Web3 not found (call after Web3 is created).");
  if (!web3.eth) throw new Error("Invalid Web3 instance.");

  // Build each contract instance once
  const userManager = new web3.eth.Contract(ABI.UserManager, ADDR.userManager);
  const createProp = new web3.eth.Contract(
    ABI.CreateProperty,
    ADDR.createProperty
  );
  const tokenise = new web3.eth.Contract(
    ABI.TokeniseProperty,
    ADDR.tokeniseProperty
  );
  const purchase = new web3.eth.Contract(
    ABI.FractionalPurchase,
    ADDR.fractionalPurchase
  );
  const record = new web3.eth.Contract(ABI.RecordModule, ADDR.recordModule);
  const history = new web3.eth.Contract(ABI.HistoryRecorder, ADDR.HistoryRecorder);

  return { userManager, createProp, tokenise, purchase, record, history };
}
window.getContracts = getContracts;


function toWeiETH(web3, ethStr) {
  return web3.utils.toWei(ethStr, "ether");
}
function toWeiGwei(web3, gweiStr) {
  return web3.utils.toWei(gweiStr, "gwei");
}
function fromWeiToETH(web3, weiStr) {
  return web3.utils.fromWei(weiStr, "ether");
}
window.toWeiETH = toWeiETH;
window.toWeiGwei = toWeiGwei;
window.fromWeiToETH = fromWeiToETH;

async function ensureNetwork(windowEthereum, expectedChainIdHex) {
  const current = await windowEthereum.request({ method: "eth_chainId" });
  if (current !== expectedChainIdHex) {
    throw new Error(
      `Wrong network. Connected chainId=${current}, expected ${expectedChainIdHex}`
    );
  }
}
window.ensureNetwork = ensureNetwork;
