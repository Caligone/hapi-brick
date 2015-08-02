# Hapi-Brick

***Hapi-Brick*** allows you to functionally split your Hapi server into Bricks.

A Brick is a Hapi plugin that includes a full MVC structure and increases the maintainability and the reusability of your Hapi development.


## Getting started

**1. Install *hapi-brick***

```
npm install --save hapi-brick
```

**2. Load the Brick Engine**
```js
server.register({register: require('hapi-brick')}, function (err) {
    // Handle errors
});
```

**3. Create your Brick**

Here is the required structure :
```
├── UserBrick
│   ├── index.js                # Entry point of your Brick
│   ├── models                  # Folder of your models
│   │   └── User.model.js       # A model of your Brick
│   └── routes                  # Folder of your routes
│       └── User.get.route.js   # A route of your Brick
└── index.js                    # The Hapi server
```

The `index.js` describes the Brick and builds it from the Brick Engine :
```js
'use strict';

module.exports.register = function (server, options, next) {
    // Retrieve the Brick Engine from the Hapi server object
    var Brick = server.plugins.Brick.Engine;
    // Create the current Brick
    var UserBrick = new Brick(__dirname, options);
    // Register the current Brick
    UserBrick.register(server, options, next);
};

module.exports.register.attributes = {
    // Name of the Brick
    name: 'UserBrick',
    // Version of the Brick
    version: '1.0.0',
    // Dependencies of the Brick (you can add any Hapi plugin here)
    dependency: ['hapi-brick']
};
```

**Model**

A simple `User.model.js` mongoose model file :
```js
'use strict';
    
module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        firstname: {
            type: String
        },
        lastname: {
            type: String
        }
    });

    var UserModel;
    if (mongoose.models.User) {
        UserModel = mongoose.models.User;
    }
    else {
        UserModel = mongoose.model('User', UserSchema);   
    }

    return UserModel;
};
```

**or** a Sequelize model file : 
```js
"use strict";

module.exports = function(sequelize, DataTypes) {

    var User = sequelize.define("Users", {
        id_user: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING(45)
        },
        lastname: {
            type: DataTypes.STRING(45)
        }
    }, {});

    return User;
};
```
*If you use Sequelize, your have to change the loader (see Full Brick options below).*

**Controller**


A simple `User.get.route.js` route file :
```js
'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            var users = [{
                id_user: 1,
                fistname: "John",
                lastname: "Doe"
            }];
            return reply(users);
        }
    }
];
```
**4. Load your Brick**

Finally load your Brick from its folder
```js
server.register({register: require('./UserBrick')}, function (err) {
    // Handle errors
});
```

## Full Brick options
```
{
    routes: {
        loader: 'classic'
    },
    models: {
        loader: 'mongoose|sequelize',
        options: {
            uri: '',
            # Options for Mongoose or Sequelize connection
            opts: {}
        }
    },
    tests: {
        loader: 'lab'
    }
}
```
[Mongoose options](http://mongoosejs.com/docs/api.html#index_Mongoose-connect) | [Sequelize options](http://docs.sequelizejs.com/en/latest/api/sequelize/)

## More complex Brick structure

```
├── UserBrick
│   ├── index.js
│   ├── auth
│   │   └── JWT.auth.js
│   ├── models
│   │   └── User.model.js
│   ├── routes
│   │   ├── User.get.route.js
│   │   └── User.post.route.js
│   │   └── User.put.route.js
│   │   └── User.delete.route.js
│   ├── test
│   │   ├── User.create.spec.js
│   │   └── User.login.spec.js
│   │   └── User.update.spec.js
│   │   └── User.get.spec.js
│   │   └── User.delete.spec.js
│   └── views
│       └── validation.email.html
```

## How does it works

The Brick Engine simply load differents kind of file from their extension. Here are the available extensions :
* **.route.js* : A route file
* **.model.js* : A model file
* **.spec.js* : A test file (soon)

## Next things to do

* **Add the tests handler**
* Add some documentation
* Create a demo project
* Create a Yeoman generator
* Add the custom database handler
* Add the Auth handler