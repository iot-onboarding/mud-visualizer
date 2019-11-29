<a href="https://github.com/iot-onboarding/mud-visualizer/blob/master/README.md"><img src="https://github.com/iot-onboarding/mud-visualizer/blob/master/img/other_icons/github_logo.png?sanitize=true" width="60%"></a>

# Manufacturer Usage Description (MUD) Visualizer
> Warning: mud-visualizer is currently beta. Use at your own risk.

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause) 
[![Github Issues](http://img.shields.io/github/issues/iot-onboarding/mud-visualizer/bug.svg)](https://github.com/iot-onboarding/mud-visualizer/issues)
[![Github Issues](http://img.shields.io/github/issues/iot-onboarding/mud-visualizer/enhancement.svg)](https://github.com/iot-onboarding/mud-visualizer/issues)
[![Github Issues](http://img.shields.io/github/issues-pr/iot-onboarding/mud-visualizer.svg)](https://github.com/iot-onboarding/mud-visualizer/pulls)


This tool can be used to visualize the MUD files in JSON format.

![mud-visualizer](img/recordit/recordit.gif)

## Table of Contents 

- [Motivation](#Motivation)
- [Installation](#installation)
- [Supported MUD Abstractions](#features)
- [Contribution](#contribution)
- [Support](#support)
- [License](#license)

## Motivation

MUD files are plain text files in JSON format that contain ACL rules for a device. A MUD file can contains tens or hundrends of ACL rules which makes it difficult to read and validate the files manually. mud-visualizer will help you to read and validate (and modify in near future) the MUD files.  

## Installation

Use the following commands to install and run `mud-visualizer`: 

```shell
$ git clone https://github.com/iot-onboarding/mud-visualizer
$ cd mud-visualizer
$ npm install
$ npm start
```

## Supported MUD Abstractions

Currently the following MUD abstractions are supported in both `incoming` and `outgoing` traffic directions: 

- `domain-names`
- `local-networks`
- `same-manufacturer`
- `manufacturer`
- `my-controller`
- `controller`

## Contribution

Contributions are welcome! Submit your pull requests to the `master` branch.

## Support

Feel free to reach out to us at <mud@ietf.org>.

Also, you are strongly encouraged to use Github's <a href="https://github.com/iot-onboarding/mud-visualizer/issues" target="_blank">Issues</a> to submit new issues, or request enhancements or new features.

## License

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause) 

- **[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)**
- Copyright 2019 © <a href="https://www.cisco.com/" target="_blank">Cisco Systems</a>.
