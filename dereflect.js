Java.perform(function() {

    var internalClasses = ["android.", "org."]; 
    var classDef = Java.use('java.lang.Class');
    var classLoaderDef = Java.use('java.lang.ClassLoader');
    var forName = classDef.forName.overload('java.lang.String', 'boolean', 'java.lang.ClassLoader');
    var loadClass = classLoaderDef.loadClass.overload('java.lang.String', 'boolean');
    var getMethod = classDef.getMethod.overload('java.lang.String', '[Ljava.lang.Object;');
    var reflect = Java.use('java.lang.reflect.Method')
    //var invoke = reflect.invoke.overload('java.lang.Object', '[Ljava.lang.Object;')
    //java.lang.reflect.Method.invoke

    var f = Java.use("java.io.File")
    var url = Java.use("java.net.URL")
    
    f.$init.overload("java.net.URI").implementation = function(a){
        console.log("URI called")
        f.$init(a)

    }

    forName.implementation = function(class_name, flag, class_loader) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            console.log("Reflection => forName => " + class_name);
        }

        return forName.call(this, class_name, flag, class_loader);
    }
    classDef.getMethod.overload('java.lang.String', '[Ljava.lang.Object;').implementation = function (a,b,c) {
        console.log("[+] getMethod catched -> " + a)
        return this.getMethod(a,b)
    }  

    loadClass.implementation = function(class_name, resolve) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            console.log("Reflection => loadClass => " + class_name);
        }
        return loadClass.call(this, class_name, resolve);
    }
});


    