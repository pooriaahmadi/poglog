# Pog Log

A package for monitoring script log and system usage with server or personal pc

## Features

- Nice UI
- Realtime monitoring
- Connecting to server and monitoring
- Able to run any script
- Cross platform

## Demo

![DEMO.PNG](https://cdn.discordapp.com/attachments/875098458791485473/876134351660806195/unknown.png)

## Shortcuts

- [Installation](#installation)
- [Server](#server)
- [Client](#client)

## Installation

```bash
npm install poglog -g
```

- by using this script, You install poglog and poglog-client Client
- Yeah that's pretty much it!

## Server CLI

```bash
poglog FILENAME.FILE_EXTENSION FILEOPTIONS --pass APASSWORD --port 1234
ex.
poglog index.js development --pass POoA
```

```bash
Options:
      --version           Show version number                          [boolean]
      --password, --pass  password for remote connecting                [string]
      --port              Socket port default: 6754     [number] [default: 6754]
      --engine            compiler for running script   [string] [default: node]
  -h, --help              Show help                                    [boolean]
```

## Client CLI

```bash
poglog-client --ip IP_ADDR --pass APASSWORD --port 1234 --simple
ex.
poglog-client --ip 192.168.1.1 -pass POoa
```

- if you use --simple, You'll get just the script log not system usage and ...

```bash
Options:
      --version           Show version number                          [boolean]
      --address, --ip     ex. localhost, 192.168.1.5
                                                 [string] [default: "localhost"]
      --password, --pass  password for remote connecting                [string]
      --port              Socket port, default: 6754    [number] [default: 6754]
      --simple            If used, Just logs will be shown.             [string]
  -h, --help              Show help                                    [boolean]
```

## Authors

- [@pooriaahmadi](https://www.github.com/pooriaahmadi)

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
