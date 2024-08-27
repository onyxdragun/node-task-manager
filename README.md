# Node-Task-Manager

## Description

My career in software development has always been behind an NDA so I have not been able to share code I've written. To help show my experience I thought I would upload code I've written for various tutorils I've been following to learn new skills. Node-Task-Manager is one of of them.

Node-Task-Manager, as of this ReadMe, is a RESTful API that includes CRUD (Create, Read, Update and Delete) model.

## Installation

** Clone the respository**:
```bash
git clone https://github.com/onyxdragun/node-task-manager
cd node-task-manager
npm install
```

## Usage
Start the development server by running:
```bash
npm run dev
```
This sets up the RESTful API to accept incoming requests

## API Overview
This RESTful API provides endpoints for mangaging tasks that uses can use to perform Create, Read, Update and Delete operations

### Users

#### 1. Create a User
**Endpoint**: `/users/`
***Method**: `POST`
**Description**: Creates a new user
**Request Body**:
```json
{
  "name": "John",
  "email": "john@exmaple.com",  // *required *
}
```
**Response**: 201 Created

### Tasks
