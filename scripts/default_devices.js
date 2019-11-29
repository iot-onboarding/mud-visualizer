// if you need more defautl devices, just add them here in this default_mudfiles variable with some key
default_mudfiles = {
    "1": {
        "ietf-mud:mud": {
            "mud-version": 1,
            "mud-url": "https://www.fridgemaker.org/smartfridge",
            "last-update": "2019-11-28T20:38:40+00:00",
            "cache-validity": 48,
            "is-supported": true,
            "systeminfo": "This is a smart fridge",
            "mfg-name": "FridgeMakers LLC.",
            "documentation": "https://www.fridgedocs.com/smartfridge",
            "model-name": "smartfridge",
            "from-device-policy": {
                "access-lists": {
                    "access-list": [{
                        "name": "mud-16483-v4fr"
                    },
                        {
                            "name": "mud-16483-v6fr"
                        }
                    ]
                }
            },
            "to-device-policy": {
                "access-lists": {
                    "access-list": [{
                        "name": "mud-16483-v4to"
                    },
                        {
                            "name": "mud-16483-v6to"
                        }
                    ]
                }
            }
        },
        "ietf-access-control-list:acls": {
            "acl": [{
                "name": "mud-16483-v4to",
                "type": "ipv4-acl-type",
                "aces": {
                    "ace": [{
                        "name": "cl0-todev",
                        "matches": {
                            "ipv4": {
                                "ietf-acldns:src-dnsname": "www.fridgemakers.com"
                            }
                        },
                        "actions": {
                            "forwarding": "accept"
                        }
                    },
                        {
                            "name": "cl1-todev",
                            "matches": {
                                "ipv4": {
                                    "ietf-acldns:src-dnsname": "updates.fridgemakers.com",
                                    "protocol": 6
                                },
                                "tcp": {
                                    "source-port": {
                                        "operator": "eq",
                                        "port": 443
                                    }
                                }
                            },
                            "actions": {
                                "forwarding": "accept"
                            }
                        }
                    ]
                }
            },
                {
                    "name": "mud-16483-v4fr",
                    "type": "ipv4-acl-type",
                    "aces": {
                        "ace": [{
                            "name": "cl0-frdev",
                            "matches": {
                                "ipv4": {
                                    "ietf-acldns:dst-dnsname": "www.fridgemakers.com"
                                }
                            },
                            "actions": {
                                "forwarding": "accept"
                            }
                        },
                            {
                                "name": "cl1-frdev",
                                "matches": {
                                    "ipv4": {
                                        "ietf-acldns:dst-dnsname": "updates.fridgemakers.com",
                                        "protocol": 6
                                    },
                                    "tcp": {
                                        "destination-port": {
                                            "operator": "eq",
                                            "port": 443
                                        }
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "mud-16483-v6to",
                    "type": "ipv6-acl-type",
                    "aces": {
                        "ace": [{
                            "name": "cl0-todev",
                            "matches": {
                                "ipv6": {
                                    "ietf-acldns:src-dnsname": "www.fridgemakers.com"
                                }
                            },
                            "actions": {
                                "forwarding": "accept"
                            }
                        },
                            {
                                "name": "cl1-todev",
                                "matches": {
                                    "ipv6": {
                                        "ietf-acldns:src-dnsname": "updates.fridgemakers.com",
                                        "protocol": 6
                                    },
                                    "tcp": {
                                        "source-port": {
                                            "operator": "eq",
                                            "port": 443
                                        }
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "mud-16483-v6fr",
                    "type": "ipv6-acl-type",
                    "aces": {
                        "ace": [{
                            "name": "cl0-frdev",
                            "matches": {
                                "ipv6": {
                                    "ietf-acldns:dst-dnsname": "www.fridgemakers.com"
                                }
                            },
                            "actions": {
                                "forwarding": "accept"
                            }
                        },
                            {
                                "name": "cl1-frdev",
                                "matches": {
                                    "ipv6": {
                                        "ietf-acldns:dst-dnsname": "updates.fridgemakers.com",
                                        "protocol": 6
                                    },
                                    "tcp": {
                                        "destination-port": {
                                            "operator": "eq",
                                            "port": 443
                                        }
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};