default_mudfiles = {
    "1": {
        "ietf-mud:mud": {
            "mud-version": 1,
            "mud-url": "https://dell.com/PC",
            "last-update": "2019-09-03T21:01:15+00:00",
            "cache-validity": 48,
            "is-supported": true,
            "systeminfo": "This is a personal PC ",
            "mfg-name": "DELL",
            "documentation": "https://dell.com/docs",
            "model-name": "PC",
            "from-device-policy": {
                "access-lists": {
                    "access-list": [
                        {
                            "name": "mud-80713-v4fr"
                        },
                        {
                            "name": "mud-80713-v6fr"
                        }
                    ]
                }
            },
            "to-device-policy": {
                "access-lists": {
                    "access-list": [
                        {
                            "name": "mud-80713-v4to"
                        },
                        {
                            "name": "mud-80713-v6to"
                        }
                    ]
                }
            }
        },
        "ietf-access-control-list:acls": {
            "acl": [
                {
                    "name": "mud-80713-v4to",
                    "type": "ipv4-acl-type",
                    "aces": {
                        "ace": [
                            {
                                "name": "cl0-todev",
                                "matches": {
                                    "ipv4": {
                                        "ietf-acldns:src-dnsname": "www.google.com"
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
                                        "ietf-acldns:src-dnsname": "www.amazon.com"
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            },
                            {
                                "name": "loc0-todev",
                                "matches": {
                                    "ietf-mud:mud": {
                                        "local-networks": [
                                            null
                                        ]
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
                    "name": "mud-80713-v4fr",
                    "type": "ipv4-acl-type",
                    "aces": {
                        "ace": [
                            {
                                "name": "cl0-frdev",
                                "matches": {
                                    "ipv4": {
                                        "ietf-acldns:dst-dnsname": "www.google.com"
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
                                        "ietf-acldns:dst-dnsname": "www.amazon.com"
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            },
                            {
                                "name": "loc0-frdev",
                                "matches": {
                                    "ietf-mud:mud": {
                                        "local-networks": [
                                            null
                                        ]
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
                    "name": "mud-80713-v6to",
                    "type": "ipv6-acl-type",
                    "aces": {
                        "ace": [
                            {
                                "name": "cl0-todev",
                                "matches": {
                                    "ipv6": {
                                        "ietf-acldns:src-dnsname": "www.google.com"
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
                                        "ietf-acldns:src-dnsname": "www.amazon.com"
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            },
                            {
                                "name": "loc0-todev",
                                "matches": {
                                    "ietf-mud:mud": {
                                        "local-networks": [
                                            null
                                        ]
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
                    "name": "mud-80713-v6fr",
                    "type": "ipv6-acl-type",
                    "aces": {
                        "ace": [
                            {
                                "name": "cl0-frdev",
                                "matches": {
                                    "ipv6": {
                                        "ietf-acldns:dst-dnsname": "www.google.com"
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
                                        "ietf-acldns:dst-dnsname": "www.amazon.com"
                                    }
                                },
                                "actions": {
                                    "forwarding": "accept"
                                }
                            },
                            {
                                "name": "loc0-frdev",
                                "matches": {
                                    "ietf-mud:mud": {
                                        "local-networks": [
                                            null
                                        ]
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
}