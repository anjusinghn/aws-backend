# Distributed Version Control System (Git-Inspired)

A distributed version control system prototype inspired by Git, built using Node.js, React, MongoDB, and AWS S3.

This project supports local repository initialization, file staging, commit snapshots, push/pull synchronization, snapshot restoration, and cloud-backed remote repository hosting.

---

# Overview

The project implements core version control concepts such as:

* Local repository management
* File staging architecture
* Snapshot-based commits
* Remote push/pull synchronization
* Cloud-backed commit storage
* Historical snapshot restoration
* Repository hosting through a deployed frontend
* Distributed synchronization using AWS S3

---

# Core Features

## Local Version Control Engine

* Initialize repositories locally
* Stage files before committing
* Create immutable commit snapshots
* Restore repository state using revert functionality

---

## Distributed Synchronization

* Push local commits to remote cloud storage
* Pull remote commits back into local repositories
* Synchronize repository state across environments

AWS S3 is used as the remote object storage layer for commit snapshots.

---

## Web Repository Interface

The frontend application allows users to:

* Create repositories
* Browse repository files
* View commit history
* Manage issues
* Access synchronized repository data from cloud storage

---

# Tech Stack

## Frontend

* React
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* AWS S3
* Socket.io

---

# System Architecture

Working Directory
↓
Staging Area (`.mygit/staging`)
↓
Commit Snapshots (`.mygit/commits`)
↓
AWS S3 Remote Storage
↓
MongoDB Repository Metadata
↓
web-based repository visualization

---

# CLI Commands

## Initialize Repository

```bash
node index.js init
```

Creates local `.mygit` repository structure.

---

## Stage Files

```bash
node index.js add <file>
```

Moves files into the staging area.

---

## Commit Changes

```bash
node index.js commit "commit message"
```

Creates snapshot-based commits inside `.mygit/commits`.

---

## Push Commits

```bash
node index.js push <repoId>
```

Uploads local commit snapshots to AWS S3 and synchronizes repository metadata.

---

## Pull Remote Commits

```bash
node index.js pull <repoId>
```

Downloads remote commit snapshots from AWS S3 into the local repository.

---

## Revert Repository

```bash
node index.js revert <commitId>
```

Restores repository state to a previous snapshot.

---

# Example Workflow

```bash
node index.js init

node index.js add hello.js

node index.js commit "initial commit"

node index.js push <repoId>
```

The pushed commits are then visible inside the deployed web-based repository visualization.

---

# Project Structure

```bash
backend/
│
├── controllers/
├── routes/
├── models/
├── config/
├── .mygit/
│   ├── staging/
│   └── commits/
│
├── index.js
└── README.md
```

---

# Challenges Solved

* Snapshot-based commit storage
* Local and remote repository synchronization
* Distributed commit persistence using AWS S3
* Repository restoration using revert functionality
* Connecting CLI operations with deployed frontend visualization

---

# Future Improvements

* Branching support
* Merge conflict resolution
* Diff viewer
* Real-time collaboration
* File change tracking
* Improved authentication
* Optimized storage strategy

---

# Deployment

Frontend deployed on AWS Amplify.

Backend and APIs deployed on Render.

Remote repository synchronization powered by AWS S3.
