# Nutshell API Client

[![Build Status](https://travis-ci.org/IanVS/nutshell-api-client.svg?branch=add-travis)](https://travis-ci.org/IanVS/nutshell-api-client)
[![Dependency Status](https://www.versioneye.com/user/projects/5609a30e5a262f001a00022a/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5609a30e5a262f001a00022a)

Example [Nutshell](https://www.nutshell.com/) API client written in Node.js.

## Installation

```bash
npm install -g nutshell-api-client
```

## Usage

**Note:** Requires Node.js version `4.0.0` or greater.

To use the cli:

```bash
nutshell
```

The cli will ask for a user name and password, defaulting to the demo account from Nutshell's docs.  

It will also ask you for:
* The kind of objects you want to find
* The quantity of results you want
* Whether and how you want the results ordered
* Whether you want to only get results which have a specified property, and if so what property that is

It will then query the Nutshell API and print out the results.
