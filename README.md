### Main core module to build any modules

### Installation
```npm install dolphin-core-modules --save```


How to create new Module

```
var Module = require('dolphin-core-modules').Module;

//the first parameter is name of module, unique for all modules
//the second is current path
var test = new Module('Test', __dirname); 

```

You can create factories via two ways:

* Folder
* API

1) Folder
```
root_of_package
   factories
```
You must return object with two keys:

1) name
2) entity

Example

```
module.exports = {
    name: 'Config',
    entity: {
       
    }
};
```

2) API
```
test.addFactory('Any_name', function () {
    return {
        some keys or methods
    };
});
```

After initialization your factory will get name `TestConfigFactory`


### Configuration other factories

```
test.configureFactories(function (/*Name_OF_Factory*/, /*Name_OF_Factory*/...) {
    //here you can change any settings of factories 
});
```

### Run main logic

```
test.run(function (/*Name_OF_Factory*/, /*Name_OF_Factory*/...) {
    //here you will get last versions of factories   
});
```
