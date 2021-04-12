{
	"version":"LAYASCENE3D:01",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"build",
			"ambientColor":[
				0.212,
				0.227,
				0.259
			],
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			{
				"type":"Camera",
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						4,
						-5
					],
					"rotation":[
						0,
						0.9915051,
						0.1300676,
						0
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":1,
					"orthographic":false,
					"fieldOfView":60,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						1,
						1,
						1,
						0.01960784
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"DirectionLight",
				"props":{
					"name":"Directional Light",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						3,
						0
					],
					"rotation":[
						0.1093816,
						0.8754261,
						0.4082179,
						-0.2345697
					],
					"scale":[
						1,
						1,
						1
					],
					"intensity":1,
					"lightmapBakedType":0,
					"color":[
						1,
						0.9568627,
						0.8392157
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"MeshSprite3D",
				"props":{
					"name":"SkyBox",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						-100,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						1000,
						1000,
						1000
					],
					"meshPath":"Library/unity default resources-Sphere.lm",
					"enableRender":true,
					"materials":[
						{
							"path":"Assets/Assets/new/skybox/New Material.lmat"
						}
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"Sprite3D",
				"props":{
					"name":"PlayerPivot",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						0,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						1,
						1,
						1
					]
				},
				"components":[],
				"child":[
					{
						"type":"Sprite3D",
						"props":{
							"name":"CharacterSlot",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							]
						},
						"components":[
							{
								"type":"Rigidbody3D",
								"mass":1E-07,
								"isKinematic":true,
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"linearDamping":0,
								"angularDamping":0,
								"overrideGravity":false,
								"gravity":[
									0,
									0,
									0
								],
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											0,
											0.6,
											0
										],
										"size":[
											0.3,
											1,
											0.5
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[
							{
								"type":"Sprite3D",
								"props":{
									"name":"Missing Prefab",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"props":{
											"name":"Missing Prefab (Dummy)",
											"active":true,
											"isStatic":false,
											"layer":0,
											"position":[
												0,
												0,
												0
											],
											"rotation":[
												0,
												0,
												0,
												-1
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[]
									}
								]
							},
							{
								"type":"Sprite3D",
								"props":{
									"name":"Missing Prefab",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"props":{
											"name":"Missing Prefab (Dummy)",
											"active":true,
											"isStatic":false,
											"layer":0,
											"position":[
												0,
												0,
												0
											],
											"rotation":[
												0,
												0,
												0,
												-1
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[]
									}
								]
							},
							{
								"type":"Sprite3D",
								"props":{
									"name":"Missing Prefab",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"props":{
											"name":"Missing Prefab (Dummy)",
											"active":true,
											"isStatic":false,
											"layer":0,
											"position":[
												0,
												0,
												0
											],
											"rotation":[
												0,
												0,
												0,
												-1
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[]
									}
								]
							},
							{
								"type":"Sprite3D",
								"props":{
									"name":"Missing Prefab",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"props":{
											"name":"Missing Prefab (Dummy)",
											"active":true,
											"isStatic":false,
											"layer":0,
											"position":[
												0,
												0,
												0
											],
											"rotation":[
												0,
												0,
												0,
												-1
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[]
									}
								]
							},
							{
								"type":"Sprite3D",
								"props":{
									"name":"play (Missing Prefab)",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"props":{
											"name":"Missing Prefab (Dummy)",
											"active":true,
											"isStatic":false,
											"layer":0,
											"position":[
												0,
												0,
												0
											],
											"rotation":[
												0,
												0,
												0,
												-1
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[]
									}
								]
							},
							{
								"type":"MeshSprite3D",
								"props":{
									"name":"BlobShadow",
									"active":true,
									"isStatic":false,
									"layer":8,
									"position":[
										0,
										0.01,
										0
									],
									"rotation":[
										-0.707106,
										0,
										0,
										-0.7071076
									],
									"scale":[
										0.6,
										0.6,
										0.4
									],
									"meshPath":"Library/unity default resources-Quad.lm",
									"enableRender":false,
									"materials":[]
								},
								"components":[],
								"child":[]
							}
						]
					},
					{
						"type":"Sprite3D",
						"props":{
							"name":"Missing Prefab",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							]
						},
						"components":[],
						"child":[
							{
								"type":"Sprite3D",
								"props":{
									"name":"Missing Prefab (Dummy)",
									"active":true,
									"isStatic":false,
									"layer":0,
									"position":[
										0,
										0,
										0
									],
									"rotation":[
										0,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[]
							}
						]
					}
				]
			}
		]
	}
}