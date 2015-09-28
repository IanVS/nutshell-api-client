# Nutshell API Client
Example [Nutshell](https://www.nutshell.com/) API client written in Node.js.  The only functionality this currently has is to pull the names of the top 100 (alphabetical) contacts who have email addresses.

## Installation

```bash
npm install nutshell-api-client
```

## Usage

To use the cli:

```bash
nutshell
```

The cli will ask for a username and password, defaulting to the demo account from Nutshell's docs.  It will then query the Nutshell API for contacts, filter out the ones who don't have email addresses, and then print out the names of the top 100 alphabetically.